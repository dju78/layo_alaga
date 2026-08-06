'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitBookingEnquiry } from '@/app/actions/booking';
import { formatCurrency } from '@/lib/formatters';
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  startingPrice: number;
  shortDescription: string;
}

interface RentalItem {
  id: string;
  name: string;
  availableQuantity: number;
  rentalPrice: number;
  pricingUnit: string;
  category: { name: string };
}

interface Props {
  services: Service[];
  rentalItems: RentalItem[];
  preselectedServiceSlug?: string;
  initialStep?: number;
}

export default function BookingFormClient({
  services,
  rentalItems,
  preselectedServiceSlug,
  initialStep = 1,
}: Props) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerWhatsapp: '',
    preferredContact: 'WhatsApp',

    // Step 2
    eventType: 'Traditional Engagement Ceremony',
    eventDate: '',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    venueName: '',
    venueAddress: '',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    expectedGuestCount: 150,
    isOutdoor: false,
    preferredLanguage: 'English & Yoruba',
    eventColorTheme: '',

    // Step 3
    serviceIds: [] as string[],

    // Step 4
    rentalQuantities: {} as { [key: string]: number },
    deliveryRequired: true,
    setupRequired: true,

    // Step 5
    notes: '',
    specialRequests: '',
    accessibilityRequirements: '',
    referralSource: 'Social Media',
    consent: false,
  });

  // Load stored basket & preselected service on mount
  useEffect(() => {
    // 1. Saved localStorage progress
    const savedForm = localStorage.getItem('alaga_booking_draft');
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {}
    }

    // 2. Preselected service from query param
    if (preselectedServiceSlug) {
      const match = services.find((s) => s.slug === preselectedServiceSlug);
      if (match) {
        setFormData((prev) => ({
          ...prev,
          serviceIds: Array.from(new Set([...prev.serviceIds, match.id])),
        }));
      }
    }

    // 3. Preselected rentals from catalogue
    const storedBasket = localStorage.getItem('alaga_rental_basket');
    if (storedBasket) {
      try {
        const basket = JSON.parse(storedBasket);
        setFormData((prev) => ({
          ...prev,
          rentalQuantities: { ...prev.rentalQuantities, ...basket },
        }));
      } catch (e) {}
    }
  }, [preselectedServiceSlug, services]);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('alaga_booking_draft', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => {
      const exists = prev.serviceIds.includes(serviceId);
      const nextServices = exists
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId];
      return { ...prev, serviceIds: nextServices };
    });
  };

  const updateRentalQuantity = (rentalItemId: string, qty: number) => {
    setFormData((prev) => ({
      ...prev,
      rentalQuantities: {
        ...prev.rentalQuantities,
        [rentalItemId]: Math.max(0, qty),
      },
    }));
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.customerName.trim()) {
        toast.error('Please enter your full name');
        return false;
      }
      if (!formData.customerEmail.trim() || !formData.customerEmail.includes('@')) {
        toast.error('Please enter a valid email address');
        return false;
      }
      if (!formData.customerPhone.trim()) {
        toast.error('Please enter your telephone number');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.eventDate) {
        toast.error('Please select your event date');
        return false;
      }
      if (!formData.venueName.trim() || !formData.city.trim()) {
        toast.error('Please specify your venue name and city');
        return false;
      }
    }

    if (step === 5) {
      if (!formData.consent) {
        toast.error('Please accept the terms and privacy policy to proceed');
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(6, prev + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      const res = await submitBookingEnquiry(formData);
      if (res.success) {
        // Clear local storage draft
        localStorage.removeItem('alaga_booking_draft');
        localStorage.removeItem('alaga_rental_basket');

        toast.success('Booking enquiry submitted successfully!');
        router.push(`/booking/confirmation?ref=${res.bookingReference}&token=${res.accessToken}`);
      } else {
        toast.error(res.error || 'Failed to submit booking');
      }
    } catch (err) {
      toast.error('An unexpected error occurred while submitting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRentalCount = Object.values(formData.rentalQuantities).filter((q) => q > 0).length;

  return (
    <div className="bg-white rounded-3xl border border-[#E8E4E9] shadow-sm overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-[#FAF7FB] p-6 border-b border-[#E8E4E9]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#652278]">
            Step {currentStep} of 6
          </span>
          <span className="text-xs font-semibold text-[#514B54]">
            {currentStep === 1 && 'Customer Details'}
            {currentStep === 2 && 'Event Details'}
            {currentStep === 3 && 'Service Selection'}
            {currentStep === 4 && 'Rental Selection'}
            {currentStep === 5 && 'Additional Info'}
            {currentStep === 6 && 'Review & Submit'}
          </span>
        </div>
        <div className="w-full bg-[#E8E4E9] h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#652278] h-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
        {/* STEP 1: Customer Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#32113C]">1. Customer Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="e.g. Dr. Temitope Adeleke"
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Email Address *</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="e.g. temitope@example.com"
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Telephone Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="e.g. 0802 345 6789"
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">WhatsApp Number (Optional)</label>
                <input
                  type="tel"
                  name="customerWhatsapp"
                  value={formData.customerWhatsapp}
                  onChange={handleInputChange}
                  placeholder="e.g. 0802 345 6789"
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Preferred Contact Method</label>
                <div className="flex gap-4">
                  {['WhatsApp', 'Telephone', 'Email'].map((method) => (
                    <label key={method} className="flex items-center gap-2 text-sm text-[#17131A] cursor-pointer">
                      <input
                        type="radio"
                        name="preferredContact"
                        value={method}
                        checked={formData.preferredContact === method}
                        onChange={handleInputChange}
                        className="accent-[#652278]"
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Event Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#32113C]">2. Event Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                >
                  <option value="Traditional Engagement Ceremony">Traditional Engagement Ceremony</option>
                  <option value="Family Introduction Ceremony">Family Introduction Ceremony</option>
                  <option value="Wedding Reception Hosting (MC)">Wedding Reception Hosting (MC)</option>
                  <option value="Eru Iyawo Dowry Packaging">Eru Iyawo Dowry Packaging</option>
                  <option value="Birthday Surprise Visit">Birthday Surprise Visit</option>
                  <option value="Equipment Rental Only">Equipment Rental Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Start Time</label>
                <input
                  type="text"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 10:00 AM"
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">End Time</label>
                <input
                  type="text"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 04:00 PM"
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Venue Name *</label>
                <input
                  type="text"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleInputChange}
                  placeholder="e.g. Imperial Event Hall"
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Venue Street Address</label>
                <input
                  type="text"
                  name="venueAddress"
                  value={formData.venueAddress}
                  onChange={handleInputChange}
                  placeholder="e.g. 12 Ceremonial Avenue"
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">City / Town *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Ikeja"
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">State / Region</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g. Lagos State"
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Expected Guest Count</label>
                <input
                  type="number"
                  name="expectedGuestCount"
                  value={formData.expectedGuestCount}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#514B54] mb-2">Preferred Language</label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
                >
                  <option value="English & Yoruba">English & Yoruba (Recommended)</option>
                  <option value="Strictly Yoruba">Strictly Yoruba</option>
                  <option value="Strictly English">Strictly English</option>
                  <option value="English & Pidgin">English & Pidgin</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Select Services */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#32113C]">3. Select Ceremony Services</h2>
            <p className="text-xs text-[#514B54]">Choose one or multiple services required for your event:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => {
                const isSelected = formData.serviceIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#652278] bg-[#F1E8F4]/50 shadow-sm'
                        : 'border-[#E8E4E9] bg-white hover:border-[#D8D3DA]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#32113C]">{service.name}</h4>
                        <p className="text-xs text-[#514B54] mt-1">{service.shortDescription}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isSelected ? 'bg-[#652278] border-[#652278] text-white' : 'border-[#D8D3DA]'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                    <div className="mt-3 text-xs font-bold text-[#652278]">
                      {service.startingPrice > 0 ? `From ${formatCurrency(service.startingPrice)}` : 'Custom Quote'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Select Rental Equipment */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#32113C]">4. Select Event Rental Equipment</h2>
                <p className="text-xs text-[#514B54]">Adjust quantities for items needed at your venue:</p>
              </div>
              <span className="text-xs font-bold text-[#652278] bg-[#F1E8F4] px-3 py-1.5 rounded-full">
                {selectedRentalCount} Items Selected
              </span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {rentalItems.map((item) => {
                const qty = formData.rentalQuantities[item.id] || 0;
                return (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-[#FAF7FB] rounded-xl border border-[#E8E4E9]">
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#32113C]">{item.name}</h4>
                      <p className="text-xs text-[#7E7781]">{formatCurrency(item.rentalPrice)} {item.pricingUnit}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateRentalQuantity(item.id, qty - 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-[#D8D3DA] flex items-center justify-center font-bold text-[#32113C]"
                      >
                        -
                      </button>
                      <span className="font-bold text-sm text-[#32113C] w-6 text-center">{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateRentalQuantity(item.id, qty + 1)}
                        className="w-8 h-8 rounded-lg bg-[#652278] text-white flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-[#F1E8F4]/50 rounded-xl border border-[#D8D3DA] flex items-center justify-between text-xs font-medium">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="deliveryRequired"
                  checked={formData.deliveryRequired}
                  onChange={handleInputChange}
                  className="accent-[#652278]"
                />
                Require Venue Delivery & Dispatch
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="setupRequired"
                  checked={formData.setupRequired}
                  onChange={handleInputChange}
                  className="accent-[#652278]"
                />
                Require On-Site Equipment Setup
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: Additional Info */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#32113C]">5. Additional Requirements</h2>

            <div>
              <label className="block text-xs font-semibold text-[#514B54] mb-2">Special Requests / Event Notes</label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                placeholder="Mention any custom color themes, specific traditional songs, or family protocol details..."
                className="w-full p-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#514B54] mb-2">How did you hear about Alaga Alayo?</label>
              <select
                name="referralSource"
                value={formData.referralSource}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] focus:border-[#652278] text-sm outline-none"
              >
                <option value="Instagram">Instagram (@alaga_alayo)</option>
                <option value="Facebook">Facebook</option>
                <option value="Word of Mouth">Friend or Family Recommendation</option>
                <option value="Google Search">Google Search</option>
                <option value="Attended Previous Event">Attended an Alaga Alayo Event</option>
              </select>
            </div>

            <div className="p-4 bg-[#FAF7FB] rounded-xl border border-[#E8E4E9]">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-[#514B54] leading-relaxed">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="accent-[#652278] mt-0.5"
                  required
                />
                <span>
                  I confirm that all information provided is accurate and agree to Alaga Alayo Events & Rentals privacy policy and booking terms.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 6: Review & Submit */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#32113C]">6. Review & Submit Enquiry</h2>

            <div className="bg-[#FAF7FB] p-6 rounded-2xl border border-[#E8E4E9] space-y-4 text-sm">
              <div className="flex justify-between border-b border-[#E8E4E9] pb-3">
                <span className="text-[#7E7781]">Customer Name:</span>
                <span className="font-bold text-[#32113C]">{formData.customerName}</span>
              </div>
              <div className="flex justify-between border-b border-[#E8E4E9] pb-3">
                <span className="text-[#7E7781]">Email & Contact:</span>
                <span className="font-bold text-[#32113C]">{formData.customerEmail} | {formData.customerPhone}</span>
              </div>
              <div className="flex justify-between border-b border-[#E8E4E9] pb-3">
                <span className="text-[#7E7781]">Event Type & Date:</span>
                <span className="font-bold text-[#32113C]">{formData.eventType} ({formData.eventDate})</span>
              </div>
              <div className="flex justify-between border-b border-[#E8E4E9] pb-3">
                <span className="text-[#7E7781]">Venue Location:</span>
                <span className="font-bold text-[#32113C]">{formData.venueName}, {formData.city}</span>
              </div>
              <div className="flex justify-between border-b border-[#E8E4E9] pb-3">
                <span className="text-[#7E7781]">Selected Services:</span>
                <span className="font-bold text-[#652278]">
                  {formData.serviceIds.length} {formData.serviceIds.length === 1 ? 'Service' : 'Services'} Selected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E7781]">Rental Equipment:</span>
                <span className="font-bold text-[#652278]">{selectedRentalCount} Items Configured</span>
              </div>
            </div>
          </div>
        )}

        {/* Buttons Nav Footer */}
        <div className="pt-6 border-t border-[#E8E4E9] flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center gap-2 border border-[#D8D3DA] text-[#514B54] hover:bg-[#FAF7FB] px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-2 bg-[#652278] hover:bg-[#7B328F] text-white px-8 py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#247A52] hover:bg-[#1e6644] text-white px-8 py-4 rounded-xl font-bold text-base transition-colors shadow-md disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 text-[#C99A3D]" />
              {isSubmitting ? 'Submitting Enquiry...' : 'Submit Booking Request'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
