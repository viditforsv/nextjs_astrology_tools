import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartData } from "@/types/astrology";

interface D1ChartProps {
  chartData: ChartData;
}

export default function D1Chart({ chartData }: D1ChartProps) {
  const formatDegree = (degrees: number, minutes: number, seconds: number) => {
    return `${degrees}° ${minutes}' ${seconds}"`;
  };

  return (
    <Card className="w-full max-w-2xl border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">D1 Chart - Rashi</CardTitle>
        <CardDescription>Planetary positions in zodiac signs</CardDescription>
        <div className="mt-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <p><span className="font-medium text-zinc-900 dark:text-zinc-200">Date & Time:</span> {chartData.dateTime}</p>
          <p><span className="font-medium text-zinc-900 dark:text-zinc-200">Location:</span> {chartData.location}</p>
          {chartData.timezone && (
            <p><span className="font-medium text-zinc-900 dark:text-zinc-200">Timezone:</span> {chartData.timezone}</p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Planet</TableHead>
              <TableHead className="font-semibold">Rashi</TableHead>
              <TableHead className="font-semibold text-right">Position</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chartData.planets.map((planet) => (
              <TableRow key={planet.name}>
                <TableCell className="font-medium">{planet.name}</TableCell>
                <TableCell>{planet.rashi}</TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatDegree(planet.degrees, planet.minutes, planet.seconds)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

