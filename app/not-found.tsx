'use client'

import Link from 'next/link'
import React from 'react'

const NotFound = () => (
  <div style={styles.container}>
    <h1 style={styles.title}>404 - Page Not Found</h1>
    <p style={styles.message}>
      Sorry, the page you are looking for does not exist.
    </p>
    <Link href="/dashboard" style={styles.link}>
      Go back to Home
    </Link>
  </div>
)

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center' as const,
    backgroundColor: '#f8f9fa',
    color: '#343a40',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
  },
  link: {
    fontSize: '1rem',
    color: '#007bff',
    textDecoration: 'none',
  },
}

export default NotFound
