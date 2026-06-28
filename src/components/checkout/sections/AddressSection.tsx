"use client";

import { MapPin, Phone, ChevronDown, CheckCircle2, Search, Truck, Home } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AddressData } from "../checkoutUtils";
import { useNigeriaLocations } from "@/hooks/use-nigeria-locations";

interface DropdownSelectProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  isLoading?: boolean;
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
  isLoading = false,
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <button
        id={id}
        type="button"
        disabled={disabled || isLoading}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          relative h-12 w-full rounded-2xl
          border border-gray-200 bg-gray-50
          transition-all duration-200
          flex items-center justify-between px-4
          ${disabled || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
          ${isOpen ? "border-green-500 ring-4 ring-green-100 bg-white" : "hover:border-gray-300"}
        `}
      >
        <span className={`text-sm truncate ${value ? "text-gray-900" : "text-gray-400"}`}>
          {value || (isLoading ? "Loading..." : placeholder)}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 shrink-0 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-50 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          {/* Search bar */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full h-9 rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          {/* Options list with custom scrollbar */}
          <div
            className="max-h-52 overflow-y-auto p-1.5"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#16a34a #f0fdf4",
            }}
          >
            <style>{`
              .dropdown-scroll::-webkit-scrollbar {
                width: 6px;
              }
              .dropdown-scroll::-webkit-scrollbar-track {
                background: #f0fdf4;
                border-radius: 99px;
                margin: 4px;
              }
              .dropdown-scroll::-webkit-scrollbar-thumb {
                background: #16a34a;
                border-radius: 99px;
                border: 1px solid #f0fdf4;
              }
              .dropdown-scroll::-webkit-scrollbar-thumb:hover {
                background: #15803d;
              }
            `}</style>

            <div className="dropdown-scroll max-h-52 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-sm text-gray-400">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
                  <span>Loading options...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-1 py-8">
                  <Search className="h-5 w-5 text-gray-300" />
                  <p className="text-sm text-gray-400">
                    {search ? `No results for "${search}"` : "No options available"}
                  </p>
                </div>
              ) : (
                filtered.map((opt) => {
                  const isActive = value === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                      }`}
                    >
                      <span>{opt}</span>
                      {isActive && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer count */}
          {!isLoading && filtered.length > 0 && (
            <div className="border-t border-gray-100 px-3 py-2">
              <p className="text-xs text-gray-400 text-center">
                {filtered.length} {filtered.length === 1 ? "option" : "options"} available
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AddressSectionProps {
  title: string;
  description: string;
  installationAddress: AddressData;
  deliveryAddress: AddressData;
  onInstallationChange: (field: keyof AddressData, value: string) => void;
  onDeliveryChange: (field: keyof AddressData, value: string) => void;
  isDeliverySame: boolean;
  onToggleChange: (checked: boolean) => void;
}

export function AddressSection({
  title,
  description,
  installationAddress,
  deliveryAddress,
  onInstallationChange,
  onDeliveryChange,
  isDeliverySame,
  onToggleChange,
}: AddressSectionProps) {
  const { states, loadingStates, statesError } = useNigeriaLocations();

  const {
    cities: installationCities,
    loadingCities: installationLoadingCities,
  } = useNigeriaLocations(installationAddress.state);

  const {
    cities: deliveryCities,
    loadingCities: deliveryLoadingCities,
  } = useNigeriaLocations(deliveryAddress.state);

  const handleStateChange = (stateValue: string) => {
    onInstallationChange("state", stateValue);
    if (installationAddress.city) onInstallationChange("city", "");
    if (isDeliverySame) {
      onDeliveryChange("state", stateValue);
      if (deliveryAddress.city) onDeliveryChange("city", "");
    }
  };

  const handleInstallationFieldChange = (
    field: keyof AddressData,
    value: string,
  ) => {
    onInstallationChange(field, value);
    if (isDeliverySame) onDeliveryChange(field, value);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 bg-linear-to-r from-green-50 to-white px-5 py-5 sm:px-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100">
            <MapPin className="h-5 w-5 text-green-700" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-green-950 sm:text-lg">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>

      {/* Delivery toggle — full-width banner */}
      <div
        onClick={() => onToggleChange(!isDeliverySame)}
        className={`cursor-pointer border-b transition-colors duration-200 ${
          isDeliverySame
            ? "border-green-100 bg-green-50"
            : "border-amber-100 bg-amber-50"
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
          {/* Left: icon + text */}
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
                isDeliverySame ? "bg-green-100" : "bg-amber-100"
              }`}
            >
              {isDeliverySame ? (
                <Home className={`h-4 w-4 text-green-700`} />
              ) : (
                <Truck className={`h-4 w-4 text-amber-600`} />
              )}
            </div>
            <div>
              <p
                className={`text-sm font-semibold ${
                  isDeliverySame ? "text-green-800" : "text-amber-800"
                }`}
              >
                {isDeliverySame
                  ? "Delivery to installation address"
                  : "Deliver to a different address"}
              </p>
              <p
                className={`mt-0.5 text-xs leading-relaxed ${
                  isDeliverySame ? "text-green-600" : "text-amber-600"
                }`}
              >
                {isDeliverySame
                  ? "Your order will be delivered to the same location where the solar system will be installed. Toggle off if you need delivery elsewhere."
                  : "Your order will be shipped to a separate address before installation. Fill in the delivery details below."}
              </p>
            </div>
          </div>

          {/* Right: toggle switch */}
          <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isDeliverySame}
                onChange={(e) => onToggleChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-green-300" />
            </label>
          </div>
        </div>
      </div>

      {/* Installation Address Form */}
      <div className="space-y-5 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Installation Address
        </p>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            autoComplete="street-address"
            value={installationAddress.street}
            onChange={(e) =>
              handleInstallationFieldChange("street", e.target.value)
            }
            placeholder="e.g. 12 Adeola Odeku Street"
            maxLength={120}
            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DropdownSelect
            id="installation-state"
            label="State"
            value={installationAddress.state}
            options={states}
            placeholder={statesError ? "Unable to load states" : "Select your state"}
            onChange={handleStateChange}
            required
            isLoading={loadingStates}
          />
          <DropdownSelect
            id="installation-city"
            label="City / Town"
            value={installationAddress.city}
            options={installationCities}
            placeholder={
              installationAddress.state ? "Select your city" : "Select state first"
            }
            onChange={(cityValue) =>
              handleInstallationFieldChange("city", cityValue)
            }
            disabled={!installationAddress.state}
            required
            isLoading={installationLoadingCities}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              autoComplete="tel"
              value={installationAddress.phoneNumber}
              onChange={(e) =>
                handleInstallationFieldChange("phoneNumber", e.target.value)
              }
              placeholder="e.g. 08012345678"
              maxLength={15}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      {/* Delivery Address — only when different */}
      {!isDeliverySame && (
        <>
          <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-amber-500" />
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Delivery Address
              </p>
            </div>
            <p className="mt-1 text-xs text-gray-400 ml-6">
              This is where your order will be physically shipped to.
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                autoComplete="street-address"
                value={deliveryAddress.street}
                onChange={(e) => onDeliveryChange("street", e.target.value)}
                placeholder="e.g. 5 Marina Road"
                maxLength={120}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <DropdownSelect
                id="delivery-state"
                label="State"
                value={deliveryAddress.state}
                options={states}
                placeholder="Select delivery state"
                onChange={(stateValue) => {
                  onDeliveryChange("state", stateValue);
                  if (deliveryAddress.city) onDeliveryChange("city", "");
                }}
                required
                isLoading={loadingStates}
              />
              <DropdownSelect
                id="delivery-city"
                label="City / Town"
                value={deliveryAddress.city}
                options={deliveryCities}
                placeholder={
                  deliveryAddress.state ? "Select your city" : "Select state first"
                }
                onChange={(cityValue) => onDeliveryChange("city", cityValue)}
                disabled={!deliveryAddress.state}
                required
                isLoading={deliveryLoadingCities}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  autoComplete="tel"
                  value={deliveryAddress.phoneNumber}
                  onChange={(e) =>
                    onDeliveryChange("phoneNumber", e.target.value)
                  }
                  placeholder="e.g. 08012345678"
                  maxLength={15}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}