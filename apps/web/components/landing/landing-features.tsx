import { Building2, CheckCircle2, Clock } from 'lucide-react';

export function LandingFeatures() {
  return (
    <section className="mx-auto px-4 pb-20 container">
      <div className="gap-6 lg:gap-8 grid md:grid-cols-3 mx-auto max-w-6xl">
        {/* Step 1 */}
        <div className="group relative bg-card/30 hover:bg-card/50 hover:shadow-2xl hover:shadow-blue-500/5 backdrop-blur-sm p-8 border border-border/50 rounded-3xl transition-all hover:-translate-y-1">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
          <div className="z-10 relative">
            <div className="inline-flex justify-center items-center bg-blue-500/10 mb-6 rounded-2xl w-14 h-14 text-blue-500 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="mb-3 font-bold text-2xl tracking-tight">
              1. Isi Data Vendor
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Lengkapi identitas driver dan informasi perusahaan. Sistem akan
              memvalidasi data secara otomatis.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="group relative bg-card/30 hover:bg-card/50 hover:shadow-2xl hover:shadow-purple-500/5 backdrop-blur-sm p-8 border border-border/50 rounded-3xl transition-all hover:-translate-y-1">
          <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
          <div className="z-10 relative">
            <div className="inline-flex justify-center items-center bg-purple-500/10 mb-6 rounded-2xl w-14 h-14 text-purple-500 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="mb-3 font-bold text-2xl tracking-tight">
              2. Checklist Safety
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Konfirmasi kepatuhan terhadap standar Safety, Quality,
              Productivity & Environment (SQPE).
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="group relative bg-card/30 hover:bg-card/50 hover:shadow-2xl hover:shadow-green-500/5 backdrop-blur-sm p-8 border border-border/50 rounded-3xl transition-all hover:-translate-y-1">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
          <div className="z-10 relative">
            <div className="inline-flex justify-center items-center bg-green-500/10 mb-6 rounded-2xl w-14 h-14 text-green-500 group-hover:scale-110 transition-transform duration-300">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="mb-3 font-bold text-2xl tracking-tight">
              3. Dapatkan Antrean
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Selesai! Sistem akan menerbitkan nomor antrean digital dan
              estimasi waktu tunggu Anda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
