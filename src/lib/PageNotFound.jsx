import React from 'react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-6">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">This route does not exist in Small Pro.</p>
      <Link className="text-primary font-semibold" to="/">Back to dashboard</Link>
    </div>
  );
}
