"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData } from "@/types/astrology";

interface ChartFormProps {
  onCalculate: (data: ChartData) => void;
  isLoading?: boolean;
}

export default function ChartForm({ onCalculate, isLoading }: ChartFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: "12:00",
    location: "New Delhi, India",
    latitude: "28.6139",
    longitude: "77.2090",
    timezone: "IST (GMT+5:30)"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Calculation failed');
      }

      const data = await response.json();
      onCalculate(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to calculate chart. Please try again.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Calculate Birth Chart</CardTitle>
        <CardDescription>Enter birth details to generate planetary positions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date of Birth</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Time of Birth</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="City, Country"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.0001"
                placeholder="28.6139"
                value={formData.latitude}
                onChange={(e) => handleChange('latitude', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.0001"
                placeholder="77.2090"
                value={formData.longitude}
                onChange={(e) => handleChange('longitude', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              type="text"
              placeholder="IST (GMT+5:30)"
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Calculating...' : 'Calculate Chart'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

