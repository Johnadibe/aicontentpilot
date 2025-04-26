import type { FC } from "react"

interface LogoProps {
  className?: string
}

export const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="url(#gradient)" />
      <path
        d="M21.9528 9.33344C22.3057 8.88888 23 9.13332 23 9.71121V20.4449C23 20.7782 22.7411 21.0453 22.4029 21.0453H9.59714C9.25893 21.0453 9 20.7782 9 20.4449V9.71121C9 9.13332 9.69482 8.88888 10.0466 9.33344L13.8684 14.1561C14.6571 15.1565 16.1646 15.1565 16.9534 14.1561L21.9528 9.33344Z"
        fill="white"
      />
      <path
        d="M9.88741 22.6667C9.39759 22.6667 9 23.0643 9 23.5541V23.1126C9 22.6228 9.39759 22.2252 9.88741 22.2252H22.1126C22.6024 22.2252 23 22.6228 23 23.1126V23.5541C23 23.0643 22.6024 22.6667 22.1126 22.6667H9.88741Z"
        fill="white"
        fillOpacity="0.5"
      />
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  )
}
