import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export default function Checkout() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    address: "",
    paymentMethod: "cash",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Replace with your actual form submit logic (API, webhook, etc.)
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white shadow-md rounded-2xl p-6"
      >
        {/* Customer Information */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-navy-900 flex items-center space-x-2">
              <span>Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="First Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-navy-900 focus:border-navy-900"
                required
              />
              <input
                type="text"
                name="surname"
                placeholder="Last Name"
                value={formData.surname}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-navy-900 focus:border-navy-900"
                required
              />
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-navy-900 focus:border-navy-900"
              required
            />

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-navy-900 focus:border-navy-900"
              required
            />
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-navy-900 flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Method</span>
            </h2>

            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === "cash"}
                  onChange={handleInputChange}
                  className="h-5 w-5 shrink-0 text-navy-900 border-gray-400 rounded-full focus:ring-navy-900"
                />
                <span className="text-navy-900">TBC Bank</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleInputChange}
                  className="h-5 w-5 shrink-0 text-navy-900 border-gray-400 rounded-full focus:ring-navy-900"
                />
                <span className="text-navy-900">Bank Of Georgia</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="px-6 py-3 bg-navy-900 text-white rounded-xl hover:bg-navy-800 transition"
          >
            Place Order
          </Button>
        </div>
      </form>
    </div>
  );
}
