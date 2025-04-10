const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body>{children}</body>
    </html>
  )
}

export default AppLayout
