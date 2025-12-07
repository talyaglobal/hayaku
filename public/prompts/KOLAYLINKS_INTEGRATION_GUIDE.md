# 🔗 KolayLinks 3rd Party Integration Guide

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Purpose:** Integration guide for other KolayApps to integrate KolayLinks functionality

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Shared Authentication Setup (SupaAuth)](#shared-authentication-setup-supaauth)
4. [Adding KolayLinks Menu Item to Admin Dashboard](#adding-kolaylinks-menu-item-to-admin-dashboard)
5. [Creating KolayLinks Management Dashboard](#creating-kolaylinks-management-dashboard)
6. [API Integration](#api-integration)
7. [File Upload Integration](#file-upload-integration)
8. [Edit Functionality from Other App](#edit-functionality-from-other-app)
9. [Security Considerations](#security-considerations)
10. [Error Handling](#error-handling)
11. [Testing Guide](#testing-guide)

---

## Overview

This guide enables other KolayApps to integrate KolayLinks functionality into their admin dashboards. The integration allows:

- ✅ **Single Sign-On (SSO)**: Users authenticate once via SupaAuth and access both apps seamlessly
- ✅ **Unified Dashboard**: Manage KolayLinks directly from other KolayApps admin console
- ✅ **Link Management**: Create, edit, delete, and organize links
- ✅ **File Management**: Upload and manage gallery photos/videos
- ✅ **Real-time Updates**: Changes sync immediately across platforms

---

## Prerequisites

### Required Environment Variables

**In KolayLinks Application:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**In Other KolayApp Application:**
```env
# Shared Supabase credentials (same as KolayLinks)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# KolayLinks API Configuration
KOLAYLINKS_API_URL=https://kolaylinks.com
KOLAYLINKS_API_KEY=your_api_key_optional
```

### Required Dependencies

**Both Applications:**
```json
{
  "dependencies": {
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest"
  }
}
```

### Database Setup

Both applications must share the same Supabase project and database. The KolayLinks schema includes:

- `profiles` table (with `user_id` linking to `auth.users`)
- `links` table
- `media` table
- `social_links` table
- `link_clicks` table

---

## Shared Authentication Setup (SupaAuth)

### 1. Supabase Client Configuration

**Create shared Supabase client utility:**

```typescript
// lib/supabase/shared-client.ts (in Other KolayApp)
import { createBrowserClient } from "@supabase/ssr"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side client
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server-side client
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => 
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignore if called from Server Component
        }
      },
    },
  })
}
```

### 2. Authentication Middleware

**Create middleware to check authentication:**

```typescript
// middleware.ts (in Other KolayApp)
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // Verify admin role (check profiles table)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (!profile || (profile.role !== "admin" && profile.role !== "superadmin")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
}
```

### 3. Authentication Verification Hook

**Create React hook for authentication:**

```typescript
// hooks/use-auth.ts (in Other KolayApp)
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/shared-client"
import type { User } from "@supabase/supabase-js"

interface Profile {
  id: string
  user_id: string
  username: string
  display_name: string
  role: "user" | "admin" | "superadmin"
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (data && !error) {
      setProfile(data)
    }
    setLoading(false)
  }

  return { user, profile, loading }
}
```

---

## Adding KolayLinks Menu Item to Admin Dashboard

### 1. Update Sidebar Navigation

**Modify your admin sidebar component:**

```typescript
// components/admin/sidebar.tsx (in Other KolayApp)
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Link2 } from "lucide-react" // Lucide icon for links

const mainNavigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    description: "User management",
  },
  // Add KolayLinks menu item
  {
    name: "KolayLinks",
    href: "/admin/kolaylinks",
    icon: Link2,
    description: "Manage KolayLinks",
  },
  // ... other menu items
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-background border-r">
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {mainNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </aside>
  )
}
```

### 2. Create Route Layout

**Create admin layout for KolayLinks routes:**

```typescript
// app/admin/kolaylinks/layout.tsx (in Other KolayApp)
import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/shared-client"

export const dynamic = "force-dynamic"

export default async function KolayLinksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()

  if (!supabase) {
    redirect("/admin/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!profile || (profile.role !== "admin" && profile.role !== "superadmin")) {
    redirect("/dashboard")
  }

  return <>{children}</>
}
```

---

## Creating KolayLinks Management Dashboard

### 1. Main Dashboard Page

**Create comprehensive dashboard to manage links and files:**

```typescript
// app/admin/kolaylinks/page.tsx (in Other KolayApp)
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link2, Image, Plus, Loader2 } from "lucide-react"
import { LinksManager } from "@/components/kolaylinks/links-manager"
import { FilesManager } from "@/components/kolaylinks/files-manager"
import { useAuth } from "@/hooks/use-auth"

export default function KolayLinksDashboard() {
  const { user, profile, loading } = useAuth()
  const [activeTab, setActiveTab] = useState("links")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">KolayLinks Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage links and files for KolayLinks profiles
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Across all profiles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Photos and videos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Profiles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              With KolayLinks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="links">
            <Link2 className="mr-2 h-4 w-4" />
            Links
          </TabsTrigger>
          <TabsTrigger value="files">
            <Image className="mr-2 h-4 w-4" />
            Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-4">
          <LinksManager />
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <FilesManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

### 2. Links Manager Component

**Create component to manage links:**

```typescript
// components/kolaylinks/links-manager.tsx (in Other KolayApp)
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/shared-client"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

interface Link {
  id: string
  profile_id: string
  title: string
  url: string
  order_no: number
  is_active: boolean
  created_at: string
  profile: {
    username: string
    display_name: string
  }
}

export function LinksManager() {
  const { profile } = useAuth()
  const { toast } = useToast()
  const supabase = createClient()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    profile_id: "",
  })

  useEffect(() => {
    loadLinks()
  }, [])

  const loadLinks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("links")
        .select(`
          *,
          profile:profiles!inner(
            username,
            display_name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setLinks(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load links",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingLink) {
        // Update existing link
        const { error } = await supabase
          .from("links")
          .update({
            title: formData.title.trim(),
            url: formData.url.trim(),
          })
          .eq("id", editingLink.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Link updated successfully",
        })
      } else {
        // Create new link
        const { error } = await supabase.from("links").insert({
          profile_id: formData.profile_id,
          title: formData.title.trim(),
          url: formData.url.trim(),
          order_no: 0,
          is_active: true,
        })

        if (error) throw error

        toast({
          title: "Success",
          description: "Link created successfully",
        })
      }

      setIsDialogOpen(false)
      setEditingLink(null)
      setFormData({ title: "", url: "", profile_id: "" })
      loadLinks()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save link",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return

    try {
      const { error } = await supabase.from("links").delete().eq("id", linkId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Link deleted successfully",
      })
      loadLinks()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete link",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (link: Link) => {
    setEditingLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      profile_id: link.profile_id,
    })
    setIsDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Links</CardTitle>
            <CardDescription>Manage all KolayLinks</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingLink(null)
                setFormData({ title: "", url: "", profile_id: "" })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingLink ? "Edit Link" : "Create New Link"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingLink
                      ? "Update link information"
                      : "Add a new link to a KolayLinks profile"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="profile_id">Profile Username</Label>
                    <Input
                      id="profile_id"
                      value={formData.profile_id}
                      onChange={(e) =>
                        setFormData({ ...formData, profile_id: e.target.value })
                      }
                      placeholder="username"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Link title"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLink ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Profile</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">{link.title}</TableCell>
                  <TableCell>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {link.url.length > 40
                        ? `${link.url.substring(0, 40)}...`
                        : link.url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>@{link.profile.username}</TableCell>
                  <TableCell>
                    <Badge variant={link.is_active ? "default" : "secondary"}>
                      {link.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(link.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(link)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
```

### 3. Files Manager Component

**Create component to manage files (photos/videos):**

```typescript
// components/kolaylinks/files-manager.tsx (in Other KolayApp)
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDropzone } from "react-dropzone"
import { Image, Video, Upload, Loader2, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/shared-client"
import { useToast } from "@/hooks/use-toast"

interface MediaFile {
  id: string
  profile_id: string
  type: "photo" | "video"
  file_url: string
  thumbnail_url?: string
  created_at: string
  profile: {
    username: string
  }
}

export function FilesManager() {
  const { toast } = useToast()
  const supabase = createClient()
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("media")
        .select(`
          *,
          profile:profiles!inner(username)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load files",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setUploading(true)

    try {
      // Get user profile to determine upload path
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (!userProfile) throw new Error("Profile not found")

      // Upload files to Supabase Storage
      const uploadPromises = acceptedFiles.map(async (file) => {
        const isVideo = file.type.startsWith("video/")
        const fileExt = file.name.split(".").pop()
        const fileName = `${userProfile.id}/${crypto.randomUUID()}.${fileExt}`

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("media")
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("media").getPublicUrl(fileName)

        // Insert into media table
        const { error: insertError } = await supabase.from("media").insert({
          profile_id: userProfile.id,
          type: isVideo ? "video" : "photo",
          file_url: publicUrl,
          order_no: files.length,
        })

        if (insertError) throw insertError
      })

      await Promise.all(uploadPromises)

      toast({
        title: "Success",
        description: `${acceptedFiles.length} file(s) uploaded successfully`,
      })

      loadFiles()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".webm", ".mov"],
    },
  })

  const handleDelete = async (fileId: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split("/")
      const fileName = urlParts.slice(urlParts.indexOf("media") + 1).join("/")

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([fileName])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase.from("media").delete().eq("id", fileId)

      if (dbError) throw dbError

      toast({
        title: "Success",
        description: "File deleted successfully",
      })

      loadFiles()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete file",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>Manage gallery photos and videos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm font-medium">
            {isDragActive
              ? "Drop files here"
              : "Drag & drop files here, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Supports images and videos
          </p>
        </div>

        {uploading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Uploading files...</span>
          </div>
        )}

        {/* Files Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <div key={file.id} className="relative group">
                {file.type === "photo" ? (
                  <img
                    src={file.file_url}
                    alt="Gallery"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={file.file_url}
                    className="w-full h-48 object-cover rounded-lg"
                    controls={false}
                  />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(file.id, file.file_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                    @{file.profile.username}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

---

## API Integration

### 1. Create Link API Endpoint (KolayLinks)

**Create API route in KolayLinks to accept requests from other apps:**

```typescript
// app/api/integration/links/route.ts (in KolayLinks)
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * POST /api/integration/links
 * 
 * Create a link from external KolayApp
 * 
 * Authentication: Required (via Supabase session)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { profile_id, title, url, order_no, is_active } = body

    // Validate input
    if (!profile_id || !title || !url) {
      return NextResponse.json(
        { error: "Missing required fields: profile_id, title, url" },
        { status: 400 }
      )
    }

    // Verify profile belongs to user or user is admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id, role")
      .eq("id", profile_id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Check permissions
    const { data: currentUserProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    const isAdmin =
      currentUserProfile?.role === "admin" ||
      currentUserProfile?.role === "superadmin"
    const isOwner = profile.user_id === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Create link
    const { data: link, error: linkError } = await supabase
      .from("links")
      .insert({
        profile_id,
        title: title.trim(),
        url: url.trim(),
        order_no: order_no || 0,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single()

    if (linkError) {
      console.error("Link creation error:", linkError)
      return NextResponse.json(
        { error: "Failed to create link" },
        { status: 500 }
      )
    }

    return NextResponse.json({ link }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### 2. Update Link API Endpoint

```typescript
// app/api/integration/links/[linkId]/route.ts (in KolayLinks)
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * PATCH /api/integration/links/[linkId]
 * 
 * Update a link from external KolayApp
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const supabase = await createClient()
    const { linkId } = await params

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const updates: any = {}

    if (body.title !== undefined) updates.title = body.title.trim()
    if (body.url !== undefined) updates.url = body.url.trim()
    if (body.is_active !== undefined) updates.is_active = body.is_active
    if (body.order_no !== undefined) updates.order_no = body.order_no

    // Verify permissions
    const { data: link } = await supabase
      .from("links")
      .select("profile_id, profile:profiles!inner(user_id)")
      .eq("id", linkId)
      .single()

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    const { data: currentUserProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    const isAdmin =
      currentUserProfile?.role === "admin" ||
      currentUserProfile?.role === "superadmin"
    const isOwner = link.profile.user_id === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update link
    const { data: updatedLink, error: updateError } = await supabase
      .from("links")
      .update(updates)
      .eq("id", linkId)
      .select()
      .single()

    if (updateError) {
      console.error("Link update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update link" },
        { status: 500 }
      )
    }

    return NextResponse.json({ link: updatedLink })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/integration/links/[linkId]
 * 
 * Delete a link from external KolayApp
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> }
) {
  try {
    const supabase = await createClient()
    const { linkId } = await params

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify permissions (same logic as PATCH)
    const { data: link } = await supabase
      .from("links")
      .select("profile_id, profile:profiles!inner(user_id)")
      .eq("id", linkId)
      .single()

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    const { data: currentUserProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    const isAdmin =
      currentUserProfile?.role === "admin" ||
      currentUserProfile?.role === "superadmin"
    const isOwner = link.profile.user_id === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Delete link
    const { error: deleteError } = await supabase
      .from("links")
      .delete()
      .eq("id", linkId)

    if (deleteError) {
      console.error("Link deletion error:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete link" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### 3. Client API Helper (Other KolayApp)

**Create API helper functions to call KolayLinks APIs:**

```typescript
// lib/kolaylinks/api.ts (in Other KolayApp)
import { createClient } from "@/lib/supabase/shared-client"

const KOLAYLINKS_API_URL =
  process.env.NEXT_PUBLIC_KOLAYLINKS_API_URL || "https://kolaylinks.com"

interface CreateLinkData {
  profile_id: string
  title: string
  url: string
  order_no?: number
  is_active?: boolean
}

interface UpdateLinkData {
  title?: string
  url?: string
  is_active?: boolean
  order_no?: number
}

async function getAuthHeaders() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Not authenticated")
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
    // Forward cookies for session-based auth
    Cookie: document.cookie,
  }
}

export async function createKolayLink(data: CreateLinkData) {
  const headers = await getAuthHeaders()

  const response = await fetch(`${KOLAYLINKS_API_URL}/api/integration/links`, {
    method: "POST",
    headers,
    credentials: "include", // Include cookies for session
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create link")
  }

  return response.json()
}

export async function updateKolayLink(linkId: string, data: UpdateLinkData) {
  const headers = await getAuthHeaders()

  const response = await fetch(
    `${KOLAYLINKS_API_URL}/api/integration/links/${linkId}`,
    {
      method: "PATCH",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update link")
  }

  return response.json()
}

export async function deleteKolayLink(linkId: string) {
  const headers = await getAuthHeaders()

  const response = await fetch(
    `${KOLAYLINKS_API_URL}/api/integration/links/${linkId}`,
    {
      method: "DELETE",
      headers,
      credentials: "include",
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete link")
  }

  return response.json()
}
```

---

## File Upload Integration

### 1. File Upload API Endpoint (KolayLinks)

```typescript
// app/api/integration/files/route.ts (in KolayLinks)
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * POST /api/integration/files
 * 
 * Upload file to KolayLinks gallery
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      )
    }

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const profileId = formData.get("profile_id") as string

    if (!file || !profileId) {
      return NextResponse.json(
        { error: "Missing file or profile_id" },
        { status: 400 }
      )
    }

    // Verify permissions
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id, role")
      .eq("id", profileId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const { data: currentUserProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    const isAdmin =
      currentUserProfile?.role === "admin" ||
      currentUserProfile?.role === "superadmin"
    const isOwner = profile.user_id === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Upload to storage
    const isVideo = file.type.startsWith("video/")
    const fileExt = file.name.split(".").pop()
    const fileName = `${profileId}/${crypto.randomUUID()}.${fileExt}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media")
      .upload(fileName, file)

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      )
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(fileName)

    // Insert into media table
    const { data: media, error: insertError } = await supabase
      .from("media")
      .insert({
        profile_id: profileId,
        type: isVideo ? "video" : "photo",
        file_url: publicUrl,
        order_no: 0,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Database insert error:", insertError)
      return NextResponse.json(
        { error: "Failed to save file record" },
        { status: 500 }
      )
    }

    return NextResponse.json({ media }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

---

## Edit Functionality from Other App

### Complete Edit Dialog Component

```typescript
// components/kolaylinks/edit-link-dialog.tsx (in Other KolayApp)
"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { updateKolayLink } from "@/lib/kolaylinks/api"
import { useToast } from "@/hooks/use-toast"

interface Link {
  id: string
  title: string
  url: string
  is_active: boolean
  order_no: number
}

interface EditLinkDialogProps {
  link: Link | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditLinkDialog({
  link,
  open,
  onOpenChange,
  onSuccess,
}: EditLinkDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    is_active: true,
  })

  useEffect(() => {
    if (link) {
      setFormData({
        title: link.title,
        url: link.url,
        is_active: link.is_active,
      })
    }
  }, [link])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!link) return

    setLoading(true)

    try {
      await updateKolayLink(link.id, formData)

      toast({
        title: "Success",
        description: "Link updated successfully",
      })

      onOpenChange(false)
      onSuccess()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update link",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Update link information. Changes will be saved to KolayLinks.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

---

## Security Considerations

### 1. Row Level Security (RLS)

Ensure RLS policies are properly configured in Supabase:

```sql
-- Allow users to manage their own links
CREATE POLICY "Users can manage own links"
ON links
FOR ALL
USING (profile_id IN (
  SELECT id FROM profiles WHERE user_id = auth.uid()
));

-- Allow admins to manage all links
CREATE POLICY "Admins can manage all links"
ON links
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);
```

### 2. API Rate Limiting

Implement rate limiting for integration endpoints:

```typescript
// lib/rate-limit.ts (in KolayLinks)
import { NextResponse, type NextRequest } from "next/server"

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function withRateLimit(
  request: NextRequest,
  options: { limit: number; window: number }
) {
  const ip = request.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + options.window })
    return { allowed: true }
  }

  if (record.count >= options.limit) {
    return {
      allowed: false,
      response: NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      ),
    }
  }

  record.count++
  return { allowed: true }
}
```

### 3. Input Validation

Always validate and sanitize inputs:

```typescript
import { z } from "zod"

const linkSchema = z.object({
  title: z.string().min(1).max(200),
  url: z.string().url().max(2000),
  profile_id: z.string().uuid(),
  order_no: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
})

// Use in API route
const validated = linkSchema.safeParse(body)
if (!validated.success) {
  return NextResponse.json(
    { error: "Invalid input", details: validated.error },
    { status: 400 }
  )
}
```

---

## Error Handling

### Standard Error Response Format

```typescript
// lib/api-errors.ts
export interface ApiError {
  error: string
  code?: string
  details?: any
}

export function createErrorResponse(
  error: string,
  status: number = 500,
  code?: string,
  details?: any
): Response {
  return NextResponse.json(
    {
      error,
      code,
      details,
    },
    { status }
  )
}

// Usage
return createErrorResponse("Unauthorized", 401, "UNAUTHORIZED")
```

### Client-Side Error Handling

```typescript
// lib/kolaylinks/api.ts (with error handling)
export async function createKolayLink(data: CreateLinkData) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${KOLAYLINKS_API_URL}/api/integration/links`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.error || "Failed to create link",
        response.status,
        errorData.code
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError("Network error", 0, "NETWORK_ERROR")
  }
}
```

---

## Testing Guide

### 1. Unit Tests

```typescript
// __tests__/kolaylinks/api.test.ts
import { createKolayLink, updateKolayLink } from "@/lib/kolaylinks/api"

describe("KolayLinks API", () => {
  it("should create a link", async () => {
    const mockLink = {
      profile_id: "test-profile-id",
      title: "Test Link",
      url: "https://example.com",
    }

    // Mock fetch
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ link: { ...mockLink, id: "test-id" } }),
    })

    const result = await createKolayLink(mockLink)
    expect(result.link).toBeDefined()
    expect(result.link.title).toBe("Test Link")
  })
})
```

### 2. Integration Tests

```typescript
// __tests__/integration/kolaylinks.test.ts
import { createServerSupabaseClient } from "@/lib/supabase/shared-client"

describe("KolayLinks Integration", () => {
  it("should authenticate with shared Supabase", async () => {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    expect(user).toBeDefined()
  })

  it("should create link via API", async () => {
    // Test API endpoint
    const response = await fetch("/api/integration/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${testToken}`,
      },
      body: JSON.stringify({
        profile_id: "test-profile",
        title: "Test",
        url: "https://example.com",
      }),
    })

    expect(response.ok).toBe(true)
  })
})
```

---

## Summary

This integration guide provides:

✅ **Shared Authentication**: Single Sign-On via Supabase  
✅ **Menu Integration**: Add KolayLinks to admin dashboard  
✅ **Link Management**: Create, edit, delete links  
✅ **File Management**: Upload and manage gallery files  
✅ **API Integration**: RESTful APIs for cross-app communication  
✅ **Edit Functionality**: Full CRUD operations from other apps  
✅ **Security**: RLS policies and input validation  
✅ **Error Handling**: Comprehensive error management  

### Next Steps

1. Set up shared Supabase project
2. Configure environment variables
3. Implement authentication middleware
4. Add KolayLinks menu item
5. Create dashboard components
6. Implement API endpoints
7. Test integration thoroughly
8. Deploy to production

---

**Need Help?** Contact the KolayLinks integration team or refer to the main documentation.

**Last Updated:** January 2025
