import React from 'react';
import { Button } from '@intakeoff/design-system';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to InTakeOff
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          ABA Therapy Intake Management Platform
        </p>
        <Button>Get Started</Button>
      </div>
    </div>
  );
}