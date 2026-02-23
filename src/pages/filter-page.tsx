/* ================= LOADER ================= */

import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";

interface Province {
  id: number;
  name: string;
}

interface Regency {
  id: number;
  name: string;
  province_id: number;
}

interface District {
  id: number;
  name: string;
  regency_id: number;
}

interface RegionsData {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
}

// eslint-disable-next-line react-refresh/only-export-components
export async function loader(): Promise<RegionsData> {
  const response = await fetch("/data/indonesia_regions.json");
  if (!response.ok) {
    throw new Response("Failed to load regions data", {
      status: response.status,
    });
  }
  return response.json();
}

export default function FilterPage() {
  const { provinces, regencies, districts }: RegionsData = useLoaderData();

  const [searchParams, setSearchParams] = useSearchParams();

  const provinceId = parseId(searchParams.get("province"));
  const regencyId = parseId(searchParams.get("regency"));
  const districtId = parseId(searchParams.get("district"));

  const selectedProvince = useMemo(() => {
    if (!provinceId) return undefined;
    return provinces.find((province) => province.id === provinceId);
  }, [provinceId, provinces]);

  const filteredRegencies = useMemo(() => {
    if (!selectedProvince) return [];
    return regencies.filter(
      (regency) => regency.province_id === selectedProvince.id,
    );
  }, [selectedProvince, regencies]);

  const selectedRegency = useMemo(() => {
    if (!regencyId) return undefined;
    return filteredRegencies.find((regency) => regency.id === regencyId);
  }, [filteredRegencies, regencyId]);

  const filteredDistricts = useMemo(() => {
    if (!selectedRegency) return [];
    return districts.filter(
      (district) => district.regency_id === selectedRegency.id,
    );
  }, [selectedRegency, districts]);

  const selectedDistrict = useMemo(() => {
    if (!districtId) return undefined;
    return filteredDistricts.find((district) => district.id === districtId);
  }, [districtId, filteredDistricts]);

  const provinceOptions = useMemo(
    () =>
      provinces.map((province) => ({
        label: province.name,
        value: String(province.id),
      })),
    [provinces],
  );

  const updateSearchParams = (
    key: "province" | "regency" | "district",
    value: string,
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }

    if (key === "province") {
      newSearchParams.delete("regency");
      newSearchParams.delete("district");
    }

    if (key === "regency") {
      newSearchParams.delete("district");
    }
    setSearchParams(newSearchParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasSelectedRegion = Boolean(
    selectedProvince?.name || selectedRegency?.name || selectedDistrict?.name,
  );
  const breadcrumbRegions = [
    selectedProvince?.name,
    selectedRegency?.name,
    selectedDistrict?.name,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      <aside className="w-full md:w-80 border-b border-neutral-300 bg-gray-100 px-4 py-5 md:border-r md:border-b-0">
        <header className="mb-10 flex items-center gap-2.5">
          <span className="size-5 rounded-full bg-blue-500" />
          <h1 className="text-base font-bold text-neutral-800 flex">
            Frontend Assessment
          </h1>
        </header>

        <div className="grid gap-3.5">
          <p className="text-[10px] font-bold tracking-[0.15em] text-neutral-500">
            FILTER WILAYAH
          </p>

          <SelectField
            value={selectedProvince?.id.toString() ?? ""}
            label="PROVINSI"
            name="province"
            placeholder="Pilih Provinsi"
            options={provinceOptions}
            icon={<MapPinIcon />}
            onChange={(value) => updateSearchParams("province", value)}
          />
          <SelectField
            value={selectedRegency?.id.toString() ?? ""}
            label="KOTA/KABUPATEN"
            name="regency"
            placeholder="Pilih Kota/Kabupaten"
            options={filteredRegencies?.map((regency) => ({
              label: regency.name,
              value: regency.id.toString(),
            }))}
            icon={<BuildingIcon />}
            onChange={(e) => updateSearchParams("regency", e)}
          />
          <SelectField
            value={selectedDistrict?.id.toString() ?? ""}
            label="KECAMATAN"
            name="district"
            placeholder="Pilih Kecamatan"
            options={filteredDistricts?.map((district) => ({
              label: district.name,
              value: district.id.toString(),
            }))}
            icon={<LocationIcon />}
            onChange={(e) => updateSearchParams("district", e)}
          />

          <button
            type="button"
            onClick={resetFilters}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-400 bg-blue-50 px-3 py-2.5 text-xs font-bold text-neutral-700 cursor-pointer transition-colors hover:border-blue-500 hover:bg-blue-100"
          >
            <ResetIcon />
            RESET
          </button>
        </div>
      </aside>

      <main className="grid grid-rows-[56px_1fr] w-full">
        <div className="breadcrumb flex items-center gap-2 border-b border-neutral-300 bg-white px-4 text-[11px] font-semibold text-neutral-500 md:px-6">
          <span>Indonesia</span>
          {breadcrumbRegions.map((region, index) => (
            <div key={region} className="contents">
              <span className="text-neutral-400">›</span>
              <span
                className={
                  index === breadcrumbRegions.length - 1
                    ? "text-blue-400"
                    : "text-neutral-500"
                }
              >
                {region}
              </span>
            </div>
          ))}
        </div>

        <div className="grid place-content-center gap-4 px-3 py-8 md:py-6">
          {!hasSelectedRegion && (
            <p className="text-center text-sm font-semibold text-neutral-500">
              Wilayah belum dipilih
            </p>
          )}
          {selectedProvince?.name && (
            <ResultBlock
              label="PROVINSI"
              value={selectedProvince.name}
              arrow={!!selectedRegency?.name}
            />
          )}
          {selectedRegency?.name && (
            <ResultBlock
              label="KOTA / KABUPATEN"
              value={selectedRegency.name}
              arrow={!!selectedDistrict?.name}
            />
          )}
          {selectedDistrict?.name && (
            <ResultBlock label="KECAMATAN" value={selectedDistrict.name} />
          )}
        </div>
      </main>
    </div>
  );
}

/* ======================
  COMPONENTS
====================== */

function parseId(value: string | null): number | null {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function ResultBlock({
  label,
  value,
  arrow,
}: {
  label: string;
  value: string;
  arrow?: boolean;
}) {
  return (
    <div className="text-center flex flex-col justify-center items-center">
      <p className="text-sm font-bold tracking-[0.22em] text-blue-400">
        {label}
      </p>
      <h3 className="mt-2  font-extrabold  text-neutral-800 text-4xl">
        {value}
      </h3>
      {arrow && (
        <div className="my-8">
          <ArrowDownIcon className="text-neutral-400 w-8 opacity-45" />
        </div>
      )}
    </div>
  );
}

function SelectField({
  label,
  options,
  name,
  icon,
  placeholder,
  disabled = false,
  onChange,
  value,
}: {
  label: string;
  options: { label: string; value: string }[];
  name: string;
  icon: React.ReactNode;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[10px] font-bold text-neutral-500">
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-[11px] border border-neutral-300 bg-white py-2.25 pl-9 pr-10 text-[13px] font-semibold text-neutral-700 outline-none disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          {icon}
        </span>
        <ChevronDown />
      </div>
    </div>
  );
}

/* ======================
  ICONS
====================== */
function ChevronDown() {
  return (
    <svg
      className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeWidth="2" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 20H20" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 20V8L12 5L17 8V20" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M10 10H10.01M14 10H14.01M10 13H10.01M14 13H14.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21C12 21 18 15.8 18 10.8C18 7.04 15.31 4 12 4C8.69 4 6 7.04 6 10.8C6 15.8 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="10.5"
        r="2.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6V11H15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 18V13H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 9.5C7.7 7.3 9.7 6 12 6C14 6 15.9 7 17.1 8.6M17.5 14.5C16.3 16.7 14.3 18 12 18C10 18 8.1 17 6.9 15.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowDownIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="M19 12l-7 7-7-7" />
    </svg>
  );
}
