import React from 'react'

export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'black', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
        🔥 HAYAKU
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
        Tech Backpacks Made by Gen Z, For Gen Z
      </p>
      <p style={{ fontSize: '1rem', color: '#888' }}>
        Meet Teo Guzel - 13 years old, changing tech forever
      </p>
    </div>
  )
}