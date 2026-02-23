import MapPinIcon from "../assets/map";
import BuildingIcon from "../assets/building";
import LocationIcon from "../assets/location";
import ResetIcon from "../assets/reset";
import SelectField from "../components/selectfield";

export default function FilterPage() {
  return (
    <div className="min-h-screen bg-primary-1 md:flex">
      <aside className="w-full md:w-80 border-b border-neutral-300 bg-primary-1 px-4 py-5 md:border-r md:border-b-0">
        <header className="mb-10 flex items-center gap-2.5">
          <span className="size-5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#d5e9ff_10%,#6ea8fb_65%)]" />
          <h1 className="text-lg font-bold text-neutral-800">
            Frontend Assessment
          </h1>
        </header>

        <div className="grid gap-3.5">
          <p className="text-[10px] font-bold tracking-[0.15em] text-neutral-500">
            FILTER WILAYAH
          </p>

          <SelectField
            label="PROVINSI"
            name="province"
            defaultValue="jawa-barat"
            options={[{ label: "Jawa Barat", value: "jawa-barat" }]}
            icon={<MapPinIcon />}
          />
          <SelectField
            label="KOTA/KABUPATEN"
            name="regency"
            defaultValue="kota-bandung"
            options={[{ label: "Kota Bandung", value: "kota-bandung" }]}
            icon={<BuildingIcon />}
          />
          <SelectField
            label="KECAMATAN"
            name="district"
            defaultValue="coblong"
            options={[{ label: "Coblong", value: "coblong" }]}
            icon={<LocationIcon />}
          />

          <button
            type="button"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-neutral-400 bg-transparent px-3 py-2.5 text-xs font-bold text-neutral-700 cursor-pointer transition-colors hover:border-neutral-700 hover:text-neutral-700"
          >
            <ResetIcon />
            RESET
          </button>
        </div>
      </aside>

      <main className="grid grid-rows-[56px_1fr] w-full">
        <div className="breadcrumb flex items-center gap-2 border-b border-neutral-300 bg-white px-4 text-[11px] font-semibold text-neutral-500 md:px-6">
          <span>Indonesia</span>
          <span className="text-neutral-400">›</span>
          <span>Jawa Barat</span>
          <span className="text-neutral-400">›</span>
          <span>Kota Bandung</span>
          <span className="text-neutral-400">›</span>
          <span className="text-neutral-700">Coblong</span>
        </div>

        <div className="grid place-content-center gap-4 px-3 py-8 md:py-6">
          <ResultBlock label="PROVINSI" value="Jawa Barat" />
          <span className="text-center text-xl font-bold text-neutral-300">
            |
          </span>
          <ResultBlock label="KOTA / KABUPATEN" value="Kota Bandung" />
          <span className="text-center text-xl font-bold text-neutral-300">
            |
          </span>
          <ResultBlock label="KECAMATAN" value="Coblong" />
        </div>
      </main>
    </div>
  );
}

function ResultBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-bold tracking-[0.22em] text-neutral-500">
        {label}
      </p>
      <h3 className="mt-2 text-[clamp(38px,6vw,72px)] font-extrabold leading-[1.1] text-neutral-800 md:text-[clamp(44px,6vw,72px)]">
        {value}
      </h3>
    </div>
  );
}
