import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VerificationSheet } from './verification-sheet';

const recentCheckins = [
  {
    id: 'QV-001',
    company: 'PT. Maju Jaya',
    driver: 'Budi Santoso',
    category: 'Pengiriman Bahan Baku',
    time: '10:30 WIB',
    status: 'waiting',
  },
  {
    id: 'QV-002',
    company: 'CV. Abadi Sentosa',
    driver: 'Ahmad Dani',
    category: 'Pengambilan Limbah',
    time: '10:15 WIB',
    status: 'approved',
  },
  {
    id: 'QV-003',
    company: 'PT. Transportindo',
    driver: 'Joko Widodo',
    category: 'Pengiriman Logistik',
    time: '09:45 WIB',
    status: 'rejected',
  },
  {
    id: 'QV-004',
    company: 'PT. Sinar Mas',
    driver: 'Rudi Hermawan',
    category: 'Tamu',
    time: '09:30 WIB',
    status: 'approved',
  },
  {
    id: 'QV-005',
    company: 'CV. Berkah',
    driver: 'Siti Aminah',
    category: 'Pengiriman Bahan Baku',
    time: '09:00 WIB',
    status: 'approved',
  },
];

export function RecentCheckinsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-in Terbaru</CardTitle>
        <CardDescription>Daftar 5 check-in terakhir hari ini.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Antrean</TableHead>
              <TableHead>Perusahaan</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentCheckins.map((checkin) => (
              <TableRow key={checkin.id}>
                <TableCell className="font-medium">{checkin.id}</TableCell>
                <TableCell>{checkin.company}</TableCell>
                <TableCell>{checkin.driver}</TableCell>
                <TableCell>{checkin.category}</TableCell>
                <TableCell>{checkin.time}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      checkin.status === 'approved'
                        ? 'default'
                        : checkin.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                    }
                    className={
                      checkin.status === 'approved'
                        ? 'bg-emerald-500 hover:bg-emerald-600'
                        : checkin.status === 'rejected'
                          ? 'bg-rose-500 hover:bg-rose-600'
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }
                  >
                    {checkin.status === 'approved'
                      ? 'Disetujui'
                      : checkin.status === 'rejected'
                        ? 'Ditolak'
                        : 'Menunggu'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <VerificationSheet
                    checkin={checkin}
                    trigger={<Button size="sm">Verifikasi</Button>}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
