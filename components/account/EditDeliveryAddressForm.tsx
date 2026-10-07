"use client";

import { FormEvent, useState } from "react";

type AddressValues = {
  customerName: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

type Props = {
  orderId: string;
  editable: boolean;
  initialValues: AddressValues;
};

export default function EditDeliveryAddressForm({
  orderId,
  editable,
  initialValues,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<AddressValues>(initialValues);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(
    field: keyof AddressValues,
    value: string
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startEditing() {
    setMessage("");
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    setValues(initialValues);
    setMessage("");
    setError("");
    setEditing(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/account/orders/${orderId}/address`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to update delivery address."
        );
      }

      setValues({
        customerName: result.order.customer_name ?? "",
        customerPhone: result.order.customer_phone ?? "",
        addressLine1:
          result.order.shipping_address_line1 ?? "",
        addressLine2:
          result.order.shipping_address_line2 ?? "",
        city: result.order.shipping_city ?? "",
        state: result.order.shipping_state ?? "",
        postalCode:
          result.order.shipping_postal_code ?? "",
      });

      setMessage("Delivery address updated successfully.");
      setEditing(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update delivery address."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!editable) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
        <div className="space-y-1 text-sm leading-6 text-gray-700">
          <p className="font-semibold text-[#1F2937]">
            {values.customerName}
          </p>

          <p>{values.customerPhone}</p>

          <p className="pt-2">{values.addressLine1}</p>

          {values.addressLine2 && (
            <p>{values.addressLine2}</p>
          )}

          <p>
            {values.city}, {values.state} -{" "}
            {values.postalCode}
          </p>

          <p>India</p>
        </div>

        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3 text-xs leading-5 text-gray-500">
          Your delivery address can no longer be changed because
          this order has already been shipped or completed.
        </div>
      </div>
    );
  }

  if (!editing) {
    return (
      <div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="space-y-1 text-sm leading-6 text-gray-700">
            <p className="font-semibold text-[#1F2937]">
              {values.customerName}
            </p>

            <p>{values.customerPhone}</p>

            <p className="pt-2">
              {values.addressLine1}
            </p>

            {values.addressLine2 && (
              <p>{values.addressLine2}</p>
            )}

            <p>
              {values.city}, {values.state} -{" "}
              {values.postalCode}
            </p>

            <p>India</p>
          </div>
        </div>

        {message && (
          <p className="mt-3 text-sm font-medium text-green-600">
            {message}
          </p>
        )}

        <button
          type="button"
          onClick={startEditing}
          className="mt-4 rounded-lg bg-[#C89B3C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B88B2F]"
        >
          Edit Delivery Address
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="customerName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>

          <input
            id="customerName"
            type="text"
            value={values.customerName}
            onChange={(event) =>
              updateField(
                "customerName",
                event.target.value
              )
            }
            required
            maxLength={100}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
          />
        </div>

        <div>
          <label
            htmlFor="customerPhone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>

          <input
            id="customerPhone"
            type="tel"
            value={values.customerPhone}
            onChange={(event) =>
              updateField(
                "customerPhone",
                event.target.value
              )
            }
            required
            maxLength={20}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="addressLine1"
          className="block text-sm font-medium text-gray-700"
        >
          Address
        </label>

        <input
          id="addressLine1"
          type="text"
          value={values.addressLine1}
          onChange={(event) =>
            updateField(
              "addressLine1",
              event.target.value
            )
          }
          required
          maxLength={250}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
        />
      </div>

      <div>
        <label
          htmlFor="addressLine2"
          className="block text-sm font-medium text-gray-700"
        >
          Address Line 2{" "}
          <span className="text-gray-400">(Optional)</span>
        </label>

        <input
          id="addressLine2"
          type="text"
          value={values.addressLine2}
          onChange={(event) =>
            updateField(
              "addressLine2",
              event.target.value
            )
          }
          maxLength={250}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            City
          </label>

          <input
            id="city"
            type="text"
            value={values.city}
            onChange={(event) =>
              updateField("city", event.target.value)
            }
            required
            maxLength={100}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
          />
        </div>

        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State
          </label>

          <input
            id="state"
            type="text"
            value={values.state}
            onChange={(event) =>
              updateField("state", event.target.value)
            }
            required
            maxLength={100}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
          />
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-700"
          >
            PIN Code
          </label>

          <input
            id="postalCode"
            type="text"
            inputMode="numeric"
            value={values.postalCode}
            onChange={(event) =>
              updateField(
                "postalCode",
                event.target.value
              )
            }
            required
            maxLength={10}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#C89B3C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B88B2F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Address"}
        </button>

        <button
          type="button"
          onClick={cancelEditing}
          disabled={saving}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}