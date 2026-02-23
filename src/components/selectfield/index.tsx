import ChevronDown from "../../assets/chevron-down";

export default function SelectField({
  label,
  options,
  name,
  icon,
  defaultValue,
}: {
  label: string;
  options: { label: string; value: string }[];
  name: string;
  icon: React.ReactNode;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[10px] font-bold text-neutral-500">{label}</span>
      <div className="relative">
        <select
          id={name}
          name={name}
          defaultValue={defaultValue}
          className="w-full appearance-none rounded-[11px] border border-neutral-300 bg-white py-2.25 pl-9 pr-10 text-[13px] font-semibold text-neutral-700 outline-none"
        >
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
    </label>
  );
}
