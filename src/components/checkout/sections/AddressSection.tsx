"use client";

import { MapPin, Phone, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { AddressData } from "../checkoutUtils";

const NIGERIA_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  "FCT Abuja"
];

const STATE_CITIES_MAP: Record<string, string[]> = {
  "Abia": ["Aba", "Umuahia", "Ohafia", "Arochukwu", "Isiukwuato", "Bende", "Ukwa"],
  "Adamawa": ["Yola", "Jimeta", "Mubi", "Numan", "Girei", "Mayo Belwa", "Gombi"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Oron", "Abak", "Etinan", "Mkpat Enin"],
  "Anambra": ["Awka", "Onitsha", "Nnewi", "Ekwulobia", "Ogidi", "Idemili", "Otuocha"],
  "Bauchi": ["Bauchi", "Azare", "Misau", "Jama'are", "Darazo", "Tafawa Balewa", "Ningi"],
  "Bayelsa": ["Yenagoa", "Brass", "Sagbama", "Amassoma", "Ogbia", "Nembe", "Ekeremor"],
  "Benue": ["Makurdi", "Otukpo", "Gboko", "Katsina-Ala", "Vandeikya", "Okpoga", "Aliade"],
  "Borno": ["Maiduguri", "Biu", "Gwoza", "Monguno", "Damboa", "Konduga", "Bama"],
  "Cross River": ["Calabar", "Ugep", "Ikom", "Obudu", "Ogoja", "Akamkpa", "Boki"],
  "Delta": ["Asaba", "Warri", "Sapele", "Ughelli", "Agbor", "Oleh", "Kokori"],
  "Ebonyi": ["Abakaliki", "Afikpo", "Onueke", "Ezzamgbo", "Nguzu", "Isu"],
  "Edo": ["Benin City", "Auchi", "Uromi", "Ekpoma", "Irrua", "Sabongida-Ora", "Igara"],
  "Ekiti": ["Ado Ekiti", "Ikere Ekiti", "Ilawe", "Oye", "Ise", "Emure", "Idoani"],
  "Enugu": ["Enugu", "Nsukka", "Awgu", "Oji River", "Udi", "Agbani", "Emene"],
  "Gombe": ["Gombe", "Biu", "Kumo", "Dukku", "Deba", "Billiri", "Funakaye"],
  "Imo": ["Owerri", "Orlu", "Okigwe", "Mbaise", "Oguta", "Amaigbo", "Mgbidi"],
  "Jigawa": ["Dutse", "Hadejia", "Gumel", "Kazaure", "Birnin Kudu", "Babura", "Ringim"],
  "Kaduna": ["Kaduna", "Zaria", "Kafanchan", "Saminaka", "Kachia", "Birnin Gwari", "Kagoro"],
  "Kano": ["Kano", "Wudil", "Bichi", "Rano", "Gaya", "Karaye", "Kunchi"],
  "Katsina": ["Katsina", "Daura", "Funtua", "Malumfashi", "Bakori", "Mani", "Dutsin Ma"],
  "Kebbi": ["Birnin Kebbi", "Argungu", "Yauri", "Jega", "Zuru", "Kamba", "Bagudo"],
  "Kogi": ["Lokoja", "Okene", "Kabba", "Idah", "Ajaokuta", "Dekina", "Ankpa"],
  "Kwara": ["Ilorin", "Offa", "Omu Aran", "Pategi", "Share", "Lafiagi", "Jebba"],
  "Lagos": [
    "Ikeja", "Lagos Island", "Victoria Island", "Surulere", "Mushin", "Agege",
    "Alimosho", "Ajah", "Badagry", "Epe", "Ikorodu", "Ojo", "Festac Town",
    "Maryland", "Gbagada", "Yaba", "Apapa", "Ikeja GRA"
  ],
  "Nasarawa": ["Lafia", "Keffi", "Akwanga", "Karu", "Nasarawa", "Doma", "Wamba"],
  "Niger": ["Minna", "Suleja", "Bida", "Kontagora", "Kutigi", "Lapai", "Mokwa"],
  "Ogun": ["Abeokuta", "Ijebu Ode", "Sagamu", "Ilaro", "Ota", "Iperu", "Ifo"],
  "Ondo": ["Akure", "Ondo City", "Owo", "Ikare", "Okitipupa", "Irele", "Idanre"],
  "Osun": ["Osogbo", "Ile Ife", "Ilesa", "Ede", "Ikire", "Iwo", "Ejigbo"],
  "Oyo": ["Ibadan", "Ogbomosho", "Oyo Town", "Saki", "Iseyin", "Fiditi", "Kisi"],
  "Plateau": ["Jos", "Bukuru", "Pankshin", "Langtang", "Shendam", "Bokkos", "Mangu"],
  "Rivers": ["Port Harcourt", "Obio-Akpor", "Eleme", "Bonny", "Okrika", "Degema", "Ahoada"],
  "Sokoto": ["Sokoto", "Tambuwal", "Gwadabawa", "Binji", "Wamako", "Illela", "Sabon Birni"],
  "Taraba": ["Jalingo", "Wukari", "Ibi", "Takum", "Bali", "Gembu", "Mutum Biyu"],
  "Yobe": ["Damaturu", "Potiskum", "Gashua", "Nguru", "Buni Yadi", "Geidam", "Yunusari"],
  "Zamfara": ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka", "Maru", "Shinkafi", "Tsafe"],
  "FCT Abuja": ["Abuja (Garki)", "Abuja (Wuse)", "Maitama", "Asokoro", "Kubwa", "Gwagwalada", "Nyanya", "Karu", "Bwari", "Lugbe"]
};
interface DropdownSelectProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

function DropdownSelect({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  required = false,
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
;
  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const displayValue = value || "";

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`
          relative h-12 w-full rounded-2xl
          border border-gray-200 bg-gray-50
          transition-all duration-200
          flex items-center
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          ${isOpen ? "border-green-500 ring-4 ring-green-100 bg-white" : ""}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 px-4 text-sm text-gray-900 truncate">
          {displayValue || (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`
            h-4 w-4 mr-3 text-gray-400 transition-transform duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </div>

      {/* Dropdown menu with search input */}
      {isOpen && !disabled && (
        <div
          className="
            absolute z-50 mt-2 w-full
            rounded-xl border border-gray-200
            bg-white shadow-xl
            max-h-72 overflow-hidden
            flex flex-col
          "
        >
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full rounded-lg border border-gray-200
                bg-gray-50 px-3 py-2 text-sm
                outline-none focus:border-green-500
                focus:ring-2 focus:ring-green-100
              "
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          {/* Options list */}
          <div className="overflow-y-auto max-h-52">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results found
              </div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`
                    w-full text-left px-4 py-2.5 text-sm
                    hover:bg-green-50 transition-colors
                    ${value === opt ? "bg-green-100 text-green-800 font-medium" : "text-gray-700"}
                  `}
                  onClick={() => handleSelect(opt)}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
interface AddressSectionProps {
  title: string;
  description: string;
  values: AddressData;
  onChange: (field: keyof AddressData, value: string) => void;
}

export function AddressSection({
  title,
  description,
  values,
  onChange,
}: AddressSectionProps) {
  // Get available cities for selected state
  const availableCities = values.state ? STATE_CITIES_MAP[values.state] || [] : [];

  // Auto-reset city if selected state changes and current city is not valid in new state
  useEffect(() => {
    if (values.state && values.city) {
      const validCities = STATE_CITIES_MAP[values.state] || [];
      if (!validCities.includes(values.city)) {
        // Only reset if the city is not in the new state's city list
        onChange("city", "");
      }
    } else if (!values.state && values.city) {
      // If state becomes empty, also clear city
      onChange("city", "");
    }
  }, [values.state, values.city, onChange]);

  const handleStateChange = (stateValue: string) => {
    onChange("state", stateValue);
    // City will be reset via useEffect above, but we also do immediate empty for responsiveness
    if (values.city) {
      onChange("city", "");
    }
  };

  return (
    <section
      className="
        overflow-hidden rounded-3xl
        border border-gray-200 bg-white
        shadow-sm
      "
    >
      {/* Header */}
      <div
        className="
          border-b border-gray-100
          bg-linear-to-r from-green-50 to-white
          px-5 py-5
          sm:px-6
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              flex h-12 w-12 shrink-0
              items-center justify-center
              rounded-2xl bg-green-100
            "
          >
            <MapPin className="h-5 w-5 text-green-700" />
          </div>

          <div className="min-w-0">
            <h2
              className="
                text-base font-semibold
                text-green-950
                sm:text-lg
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-1 text-sm text-gray-500
              "
            >
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="
          space-y-5
          p-5
          sm:p-6
        "
      >
        
        <div>
          <label
            htmlFor={`${title}-street`}
            className="
              mb-2 block text-sm
              font-medium text-gray-700
            "
          >
            Street Address
          </label>

          <input
            id={`${title}-street`}
            type="text"
            autoComplete="street-address"
            value={values.street}
            onChange={(event) => onChange("street", event.target.value)}
            placeholder="Enter street address"
            maxLength={120}
            className="
              h-12 w-full rounded-2xl
              border border-gray-200
              bg-gray-50 px-4
              text-sm text-gray-900
              outline-none transition-all
              duration-200
              placeholder:text-gray-400
              focus:border-green-500
              focus:bg-white
              focus:ring-4
              focus:ring-green-100
            "
          />
        </div>

        {/* City + State - now using dropdowns */}
        <div
          className="
            grid grid-cols-1 gap-4
            md:grid-cols-2
          "
        >
          {/* STATE Dropdown (36 states + FCT) */}
          <DropdownSelect
            id={`${title}-state`}
            label="State"
            value={values.state}
            options={NIGERIA_STATES}
            placeholder="Select your state"
            onChange={handleStateChange}
            required
          />

          {/* CITY Dropdown (depends on selected state) */}
          <DropdownSelect
            id={`${title}-city`}
            label="City / Town"
            value={values.city}
            options={availableCities}
            placeholder={values.state ? "Select city" : "Select state first"}
            onChange={(cityValue) => onChange("city", cityValue)}
            disabled={!values.state}
            required
          />
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor={`${title}-phone`}
            className="
              mb-2 block text-sm
              font-medium text-gray-700
            "
          >
            Phone Number
          </label>

          <div className="relative">
            <Phone
              className="
                absolute left-4 top-1/2
                h-4 w-4 -translate-y-1/2
                text-gray-400
              "
            />

            <input
              id={`${title}-phone`}
              type="tel"
              autoComplete="tel"
              value={values.phoneNumber}
              onChange={(event) => onChange("phoneNumber", event.target.value)}
              placeholder="08012345678"
              maxLength={15}
              className="
                h-12 w-full rounded-2xl
                border border-gray-200
                bg-gray-50 pl-11 pr-4
                text-sm text-gray-900
                outline-none transition-all
                duration-200
                placeholder:text-gray-400
                focus:border-green-500
                focus:bg-white
                focus:ring-4
                focus:ring-green-100
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}