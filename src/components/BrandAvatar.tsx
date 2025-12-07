// components/BrandAvatar.tsx
type BrandAvatarProps = {
  size?: number;
  text?: string; // fallback initials, default H
};

export function BrandAvatar({ size = 40, text = "H" }: BrandAvatarProps) {
  return (
    <div
      className="flex items-center justify-center rounded-full border border-black bg-white text-black font-extrabold"
      style={{ width: size, height: size, fontSize: size * 0.5, lineHeight: `${size}px` }}
    >
      {text}
    </div>
  );
}