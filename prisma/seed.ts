import { PrismaClient, Role, BookingStatus, QuotationStatus, PaymentMethod, PaymentStatus, PaymentType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Alaga Alayo database...');

  // 1. Create Default Admin User & Staff
  const adminPasswordHash = await bcrypt.hash('AdminPassword2026!', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@alagaalayo.com' },
    update: {},
    create: {
      email: 'admin@alagaalayo.com',
      name: 'Omolayo Meseko',
      passwordHash: adminPasswordHash,
      role: Role.PLATFORM_ADMIN,
      active: true,
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: 'coordinator@alagaalayo.com' },
    update: {},
    create: {
      email: 'coordinator@alagaalayo.com',
      name: 'Yewande Adewale',
      passwordHash: adminPasswordHash,
      role: Role.EVENT_COORDINATOR,
      active: true,
    },
  });

  const staffProfile1 = await prisma.staffProfile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      fullName: 'Omolayo Meseko (Alaga Alayo)',
      roleTitle: 'Principal Alaga & Lead MC',
      phone: '0807 302 1840',
      email: 'admin@alagaalayo.com',
      active: true,
    },
  });

  const staffProfile2 = await prisma.staffProfile.upsert({
    where: { userId: staffUser.id },
    update: {},
    create: {
      userId: staffUser.id,
      fullName: 'Yewande Adewale',
      roleTitle: 'Senior Event & Protocol Coordinator',
      phone: '0806 099 8745',
      email: 'coordinator@alagaalayo.com',
      active: true,
    },
  });

  // 2. Create Application Settings
  const settings = [
    { key: 'BUSINESS_NAME', value: 'Alaga Alayo Events & Rentals' },
    { key: 'BUSINESS_SLOGAN', value: 'Your Event. My Passion.' },
    { key: 'BUSINESS_PHONE_1', value: '0807 302 1840' },
    { key: 'BUSINESS_PHONE_2', value: '0806 099 8745' },
    { key: 'BUSINESS_WHATSAPP', value: '0807 302 1840' },
    { key: 'BUSINESS_INSTAGRAM', value: '@alaga_alayo' },
    { key: 'BUSINESS_FACEBOOK', value: 'https://www.facebook.com/meseko.omolayo' },
    { key: 'BUSINESS_EMAIL', value: 'alagaalayo@gmail.com' },
    { key: 'DEFAULT_CURRENCY', value: 'NGN' },
    { key: 'CURRENCY_SYMBOL', value: '₦' },
    { key: 'BANK_ACCOUNT_NAME', value: 'Alaga Alayo Events Limited' },
    { key: 'BANK_NAME', value: 'Guaranty Trust Bank (GTBank)' },
    { key: 'BANK_ACCOUNT_NUMBER', value: '0123456789' },
    { key: 'DEFAULT_DEPOSIT_PERCENTAGE', value: '50' },
  ];

  for (const s of settings) {
    await prisma.applicationSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  // 3. Create Services
  const servicesData = [
    {
      name: 'Alaga Iduro',
      slug: 'alaga-iduro',
      category: 'Traditional Ceremony',
      shortDescription: 'Spokesperson representing the Groom’s family with rich cultural elegance, traditional songs, and protocol.',
      fullDescription: 'Our Alaga Iduro service brings warmth, dignity, and cultural vibrancy to the groom’s family representation. We handle letter presentations, gift introductions, traditional songs, and ceremonial dialogues with deep Yoruba cultural etiquette and joyful banter.',
      startingPrice: 150000,
      duration: '4 - 6 Hours',
      includedItems: JSON.stringify(['Groom family representation', 'Proposal letter reading', 'Cultural songs & chants', 'Coordination of groomsmen entrance', 'Protocol direction']),
      customerProvides: JSON.stringify(['Groom family seating arrangement', 'Proposal letter package', 'Eru Iyawo items']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80']),
      featured: true,
    },
    {
      name: 'Alaga Ijoko',
      slug: 'alaga-ijoko',
      category: 'Traditional Ceremony',
      shortDescription: 'Spokesperson representing the Bride’s family with grace, warmth, tradition, and engaging ceremonial direction.',
      fullDescription: 'The Alaga Ijoko anchors the bride’s side during the traditional engagement ceremony. We guide the acceptance letter reading, bride’s unveiling ritual, family prayers, and cultural formalities with warmth, humor, and memorable elegance.',
      startingPrice: 150000,
      duration: '4 - 6 Hours',
      includedItems: JSON.stringify(['Bride family representation', 'Acceptance letter presentation', 'Bride unveiling ceremony', 'Family blessing coordination', 'Traditional engagement protocol']),
      customerProvides: JSON.stringify(['Bride family seating', 'Acceptance letter package', 'Bride entry team']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80']),
      featured: true,
    },
    {
      name: 'Introduction Ceremony',
      slug: 'introduction-ceremony',
      category: 'Traditional Ceremony',
      shortDescription: 'Full family introduction moderation ensuring intimacy, respect, and seamless family bonding.',
      fullDescription: 'A modern and respectful family introduction ceremony service. We facilitate formal family member introductions, exchange of customary tokens, brief prayers, and lighthearted icebreakers between both families.',
      startingPrice: 100000,
      duration: '3 - 4 Hours',
      includedItems: JSON.stringify(['Family introduction moderation', 'Customary greetings facilitation', 'Program flow management', 'Photo call coordination']),
      customerProvides: JSON.stringify(['List of principal family members', 'Intimate venue arrangement']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80']),
      featured: false,
    },
    {
      name: 'Engagement Ceremony (Combined Alaga)',
      slug: 'engagement-ceremony',
      category: 'Traditional Ceremony',
      shortDescription: 'Complete traditional wedding ceremony coordination featuring dual or synchronized Alaga services.',
      fullDescription: 'Full-spectrum traditional Yoruba engagement wedding management. Includes both Alaga Iduro and Alaga Ijoko coordination, music cues, protocol execution, and Eru Iyawo presentation.',
      startingPrice: 280000,
      duration: '5 - 7 Hours',
      includedItems: JSON.stringify(['Complete dual Alaga service', 'Eru Iyawo presentation guidance', 'Letter readings', 'Family blessing sequence', 'Timekeeper & protocol manager']),
      customerProvides: JSON.stringify(['Full event itinerary', 'Gifts and Eru Iyawo hampers']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80']),
      featured: true,
    },
    {
      name: 'Master of Ceremonies (MC)',
      slug: 'master-of-ceremonies',
      category: 'Reception & Event MC',
      shortDescription: 'Energetic, sophisticated, and articulate MC services for wedding receptions, corporate events, and galas.',
      fullDescription: 'Keep your guests entertained, engaged, and energized from start to finish. Our Master of Ceremonies brings eloquence, humor, seamless timeline management, and joyful crowd interaction.',
      startingPrice: 180000,
      duration: '5 - 8 Hours',
      includedItems: JSON.stringify(['Reception timeline execution', 'Bridal party entrance hype', 'Game show & guest engagement', 'Vendor cue management', 'Speech & toast moderation']),
      customerProvides: JSON.stringify(['Reception program script', 'DJ & Sound system contact']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80']),
      featured: true,
    },
    {
      name: 'Proposal and Acceptance Letter Services',
      slug: 'proposal-acceptance-letters',
      category: 'Ceremonial Writing',
      shortDescription: 'Custom handcrafted, callerigraphed, and traditionally worded Yoruba proposal and acceptance letters.',
      fullDescription: 'Exquisite traditional letters written in rich, poetic Yoruba and English text, packaged in customized frames or velvet cases to be presented during traditional engagements.',
      startingPrice: 45000,
      duration: 'Pre-event delivery',
      includedItems: JSON.stringify(['Poetic Yoruba/English drafting', 'Calligraphy or premium print finish', 'Decorative casing or frame', 'Courier or event day delivery']),
      customerProvides: JSON.stringify(['Names of Bride & Groom', 'Names of Parents & Family Houses']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80']),
      featured: false,
    },
    {
      name: 'Eru Iyawo Wrapping and Setup',
      slug: 'eru-iyawo-wrapping',
      category: 'Event Styling',
      shortDescription: 'Luxurious gift wrapping, trunk styling, and arrangement for traditional engagement dowry items.',
      fullDescription: 'Transform your engagement dowry and gift items into a stunning visual spectacle. We provide color-coordinated luxury wrapping, custom acrylic boxes, ribbon trimmings, and venue setup.',
      startingPrice: 120000,
      duration: 'Pre-event preparation',
      includedItems: JSON.stringify(['Luxury gift wrapping materials', 'Acrylic gift trunks & baskets', 'Customized name tags & bows', 'On-site venue display arrangement']),
      customerProvides: JSON.stringify(['Dowry items & gifts 48 hours prior']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80']),
      featured: true,
    },
    {
      name: 'Birthday Surprises',
      slug: 'birthday-surprises',
      category: 'Celebratory Services',
      shortDescription: 'Unforgettable surprise visits featuring trumpeters, saxophonists, cakes, balloons, and Alaga cheer.',
      fullDescription: 'Surprise your loved ones on their special day! Includes live saxophone performance, customized royal chant, birthday cake delivery, gift presentation, and video highlights.',
      startingPrice: 85000,
      duration: '1 - 2 Hours',
      includedItems: JSON.stringify(['Live Saxophonist / Trumpeter', 'Surprise Alaga chant', 'Celebration cake delivery', 'Helium balloon setup', 'HD Video highlight clip']),
      customerProvides: JSON.stringify(['Surprise venue address', 'Recipient contact / gate clearance']),
      images: JSON.stringify(['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80']),
      featured: false,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 4. Create Rental Categories & Rental Items
  const catChairs = await prisma.rentalCategory.upsert({
    where: { slug: 'chairs' },
    update: {},
    create: { name: 'Chairs', slug: 'chairs', description: 'Comfortable & stylish seating for all event sizes.' },
  });

  const catTables = await prisma.rentalCategory.upsert({
    where: { slug: 'tables' },
    update: {},
    create: { name: 'Tables', slug: 'tables', description: 'Banquet, cocktail, and VIP glass tables.' },
  });

  const catCanopies = await prisma.rentalCategory.upsert({
    where: { slug: 'canopies' },
    update: {},
    create: { name: 'Canopies & Marquees', slug: 'canopies', description: 'High-peak shades and waterproof marquees.' },
  });

  const catGenerators = await prisma.rentalCategory.upsert({
    where: { slug: 'generators' },
    update: {},
    create: { name: 'Generators & Power', slug: 'generators', description: 'Heavy-duty silent power generators.' },
  });

  const catPotsGas = await prisma.rentalCategory.upsert({
    where: { slug: 'pots-and-gas' },
    update: {},
    create: { name: 'Pots & Gas Cooking', slug: 'pots-and-gas', description: 'Commercial event cooking pots and industrial gas cylinders.' },
  });

  const catDecor = await prisma.rentalCategory.upsert({
    where: { slug: 'decor-accessories' },
    update: {},
    create: { name: 'Decoration Accessories', slug: 'decor-accessories', description: 'Traditional props, rug runners, and royal thrones.' },
  });

  const rentalItemsData = [
    {
      categoryId: catChairs.id,
      name: 'Gold Chiavari Chair with Cushion',
      slug: 'gold-chiavari-chair',
      description: 'Elegant hardwood Chiavari chair finished in ceremonial gold with comfortable white padded leatherette cushion.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80']),
      totalQuantity: 500,
      availableQuantity: 450,
      reservedQuantity: 50,
      maintenanceQuantity: 0,
      rentalPrice: 1200,
      pricingUnit: 'per chair / day',
      refundableDeposit: 200,
      deliveryCharge: 50,
      setupCharge: 20,
      minimumOrder: 10,
      condition: 'Excellent',
      featured: true,
    },
    {
      categoryId: catChairs.id,
      name: 'White Dior Banquet Chair',
      slug: 'white-dior-chair',
      description: 'Luxury white resin Dior chair with oval back design, ideal for high-end wedding receptions.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80']),
      totalQuantity: 300,
      availableQuantity: 300,
      reservedQuantity: 0,
      maintenanceQuantity: 0,
      rentalPrice: 1500,
      pricingUnit: 'per chair / day',
      refundableDeposit: 300,
      deliveryCharge: 50,
      setupCharge: 20,
      minimumOrder: 10,
      condition: 'Mint Condition',
      featured: true,
    },
    {
      categoryId: catTables.id,
      name: 'Round Banquet Table (Seats 10)',
      slug: 'round-banquet-table-10',
      description: '6ft heavy-duty foldable wooden banquet table designed for 10-guest seating arrangements.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80']),
      totalQuantity: 40,
      availableQuantity: 35,
      reservedQuantity: 5,
      maintenanceQuantity: 0,
      rentalPrice: 3500,
      pricingUnit: 'per table / day',
      refundableDeposit: 1000,
      deliveryCharge: 200,
      setupCharge: 100,
      minimumOrder: 2,
      condition: 'Good',
      featured: true,
    },
    {
      categoryId: catCanopies.id,
      name: 'Standard 20x20ft High-Peak Canopy',
      slug: 'high-peak-canopy-20x20',
      description: 'Heavy-duty waterproof PVC marquee tent canopy suitable for 50 outdoor guests.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80']),
      totalQuantity: 15,
      availableQuantity: 12,
      reservedQuantity: 3,
      maintenanceQuantity: 0,
      rentalPrice: 25000,
      pricingUnit: 'per canopy / day',
      refundableDeposit: 5000,
      deliveryCharge: 3000,
      setupCharge: 2000,
      minimumOrder: 1,
      condition: 'Excellent',
      featured: true,
    },
    {
      categoryId: catGenerators.id,
      name: 'Soundproof 45kVA Diesel Generator',
      slug: 'silent-generator-45kva',
      description: 'Ultra-silent soundproof diesel generator capable of powering full sound, lighting, and cooling systems.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80']),
      totalQuantity: 3,
      availableQuantity: 2,
      reservedQuantity: 1,
      maintenanceQuantity: 0,
      rentalPrice: 85000,
      pricingUnit: 'per event / day (includes standby technician)',
      refundableDeposit: 20000,
      deliveryCharge: 10000,
      setupCharge: 0,
      minimumOrder: 1,
      condition: 'Optimal Performance',
      featured: true,
    },
    {
      categoryId: catPotsGas.id,
      name: 'Large Catering Cook Pot (Size 50)',
      slug: 'large-catering-pot-size-50',
      description: 'Heavy-gauge aluminum event cooking pot for party rice, soups, and large quantity catering.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80']),
      totalQuantity: 25,
      availableQuantity: 20,
      reservedQuantity: 5,
      maintenanceQuantity: 0,
      rentalPrice: 4500,
      pricingUnit: 'per pot / day',
      refundableDeposit: 1000,
      deliveryCharge: 500,
      setupCharge: 0,
      minimumOrder: 1,
      condition: 'Clean & Heavy Gauge',
      featured: false,
    },
    {
      categoryId: catPotsGas.id,
      name: '50kg Industrial Gas Cylinder with Burner',
      slug: '50kg-industrial-gas-burner',
      description: 'Full 50kg cooking gas cylinder equipped with heavy-duty double cast iron burner.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80']),
      totalQuantity: 10,
      availableQuantity: 8,
      reservedQuantity: 2,
      maintenanceQuantity: 0,
      rentalPrice: 35000,
      pricingUnit: 'per full cylinder / day',
      refundableDeposit: 5000,
      deliveryCharge: 2000,
      setupCharge: 500,
      minimumOrder: 1,
      condition: 'Safety Inspected',
      featured: false,
    },
    {
      categoryId: catDecor.id,
      name: 'Royal Couple Throne Armchairs (Pair)',
      slug: 'royal-couple-throne-chairs',
      description: 'Hand-carved gold gilt royal throne chairs upholstered in deep purple velvet for Bride & Groom.',
      images: JSON.stringify(['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80']),
      totalQuantity: 5,
      availableQuantity: 4,
      reservedQuantity: 1,
      maintenanceQuantity: 0,
      rentalPrice: 40000,
      pricingUnit: 'per pair / day',
      refundableDeposit: 10000,
      deliveryCharge: 3000,
      setupCharge: 1000,
      minimumOrder: 1,
      condition: 'Showroom Grade',
      featured: true,
    },
  ];

  for (const r of rentalItemsData) {
    await prisma.rentalItem.upsert({
      where: { slug: r.slug },
      update: r,
      create: r,
    });
  }

  // 5. Create Sample Customers & Bookings
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Dr. Temitope Adeleke',
      email: 'temitope.adeleke@example.com',
      phone: '0802 345 6789',
      whatsapp: '0802 345 6789',
      preferredContact: 'WhatsApp',
      notes: 'Prefers high cultural decorum and traditional Yoruba songs.',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Chief Babatunde Ogundele',
      email: 'babatunde.ogundele@example.com',
      phone: '0803 987 6543',
      whatsapp: '0803 987 6543',
      preferredContact: 'Telephone',
      notes: 'Large wedding engagement party with 300 guests.',
    },
  });

  // Fetch created services for linking
  const serviceAlagaIduro = await prisma.service.findUnique({ where: { slug: 'alaga-iduro' } });
  const serviceAlagaIjoko = await prisma.service.findUnique({ where: { slug: 'alaga-ijoko' } });
  const serviceMC = await prisma.service.findUnique({ where: { slug: 'master-of-ceremonies' } });
  const chairItem = await prisma.rentalItem.findUnique({ where: { slug: 'gold-chiavari-chair' } });

  // Booking 1 - Confirmed
  const booking1 = await prisma.booking.create({
    data: {
      reference: 'AA-2026-1001',
      customerId: customer1.id,
      status: BookingStatus.BOOKING_CONFIRMED,
      accessToken: 'token-aa-1001-demo-access',
      eventType: 'Traditional Engagement Ceremony',
      eventDate: new Date('2026-08-15T10:00:00Z'),
      startTime: '10:00 AM',
      endTime: '04:00 PM',
      venueName: 'Imperial Event Center',
      venueAddress: '12 Ceremonial Avenue, Ikeja',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
      expectedGuestCount: 250,
      isOutdoor: false,
      preferredLanguage: 'Yoruba & English',
      eventColorTheme: 'Royal Purple & Ceremonial Gold',
      notes: 'Customer requested special entrance song for bride family.',
      referralSource: 'Instagram',
      services: {
        create: [
          { serviceId: serviceAlagaIduro!.id },
          { serviceId: serviceAlagaIjoko!.id },
        ],
      },
    },
  });

  await prisma.bookingStatusHistory.create({
    data: {
      bookingId: booking1.id,
      previousStatus: BookingStatus.ENQUIRY_RECEIVED,
      newStatus: BookingStatus.BOOKING_CONFIRMED,
      changedByUserId: adminUser.id,
      reason: 'Deposit payment received and verified.',
      internalNote: 'Bank transfer confirmed by Finance Manager.',
    },
  });

  // Create Quotation for Booking 1
  const quote1 = await prisma.quotation.create({
    data: {
      quotationNumber: 'QT-2026-0089',
      bookingId: booking1.id,
      version: 1,
      status: QuotationStatus.ACCEPTED,
      serviceCharges: 300000,
      equipmentCharges: 60000,
      deliveryCharges: 10000,
      setupCharges: 5000,
      transportCosts: 5000,
      discounts: 10000,
      tax: 0,
      subtotal: 370000,
      totalAmount: 370000,
      depositRequired: 185000,
      outstandingBalance: 0,
      paymentDeadline: new Date('2026-08-01T23:59:59Z'),
      expiryDate: new Date('2026-08-10T23:59:59Z'),
      termsAndConditions: '50% deposit required upon confirmation. Balance due 48 hours prior to event date.',
      adminNotes: 'Discount applied for combined Alaga booking package.',
    },
  });

  await prisma.quotationVersion.create({
    data: {
      quotationId: quote1.id,
      versionNumber: 1,
      snapshotData: JSON.stringify(quote1),
    },
  });

  await prisma.quotationDecision.create({
    data: {
      quotationId: quote1.id,
      decision: 'ACCEPTED',
      customerName: 'Dr. Temitope Adeleke',
      comment: 'Approved! Very excited for the event.',
      quotationVersion: 1,
    },
  });

  await prisma.payment.create({
    data: {
      paymentReference: 'PAY-2026-0045',
      bookingId: booking1.id,
      quotationId: quote1.id,
      amount: 370000,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      paymentStatus: PaymentStatus.SUCCESSFUL,
      paymentType: PaymentType.FULL_PAYMENT,
      notes: 'Full payment via GTBank transfer verified.',
      verifiedByUserId: adminUser.id,
      verifiedAt: new Date(),
    },
  });

  // Rental Reservation for Booking 1
  if (chairItem) {
    await prisma.rentalReservation.create({
      data: {
        bookingId: booking1.id,
        status: 'CONFIRMED',
        startDate: new Date('2026-08-15T07:00:00Z'),
        endDate: new Date('2026-08-15T18:00:00Z'),
        deliveryRequired: true,
        setupRequired: true,
        deliveryAddress: '12 Ceremonial Avenue, Ikeja, Lagos',
        items: {
          create: [
            {
              rentalItemId: chairItem.id,
              quantity: 50,
              unitPrice: 1200,
              refundableDeposit: 200,
              subtotal: 60000,
            },
          ],
        },
      },
    });
  }

  // Booking 2 - Enquiry Received / Awaiting Quotation
  const booking2 = await prisma.booking.create({
    data: {
      reference: 'AA-2026-1002',
      customerId: customer2.id,
      status: BookingStatus.AWAITING_QUOTATION,
      accessToken: 'token-aa-1002-demo-access',
      eventType: 'Wedding Reception MC & Rentals',
      eventDate: new Date('2026-08-22T12:00:00Z'),
      startTime: '12:00 PM',
      endTime: '07:00 PM',
      venueName: 'The Haven Event Hall',
      venueAddress: 'GRA, Ikeja',
      city: 'Lagos',
      state: 'Lagos State',
      country: 'Nigeria',
      expectedGuestCount: 300,
      isOutdoor: true,
      preferredLanguage: 'English & Pidgin',
      eventColorTheme: 'Rose & Champagne Gold',
      notes: 'Requires 200 Chiavari chairs and silent generator.',
      referralSource: 'Word of Mouth',
      services: {
        create: [
          { serviceId: serviceMC!.id },
        ],
      },
    },
  });

  // 6. Seed Testimonials & Gallery
  const testimonials = [
    {
      customerName: 'Adeola & Kemi Balogun',
      eventType: 'Traditional Engagement Ceremony',
      review: 'Alaga Alayo made our traditional wedding unforgettable! Her rich mastery of Yoruba culture, witty banter, and smooth coordination kept both families smiling throughout.',
      rating: 5,
      isApproved: true,
      isFeatured: true,
    },
    {
      customerName: 'Engr. Segun Olaniyan',
      eventType: '50th Birthday Party MC & Rentals',
      review: 'Prompt equipment delivery, pristine chairs, and top-tier MC performance. Our guests are still talking about the energy level!',
      rating: 5,
      isApproved: true,
      isFeatured: true,
    },
    {
      customerName: 'Dr. & Mrs. Folajimi',
      eventType: 'Introduction & Engagement',
      review: 'Eru Iyawo wrapping was breathtaking! Every single gift package looked like royalty. Highly recommended for couples seeking perfection.',
      rating: 5,
      isApproved: true,
      isFeatured: true,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  const galleryItems = [
    {
      title: 'Traditional Engagement Ceremony',
      caption: 'Alaga Ijoko presenting ceremonial dowry items with family elders.',
      category: 'Alaga Services',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      title: 'Gold Chiavari Banquet Setup',
      caption: '250 Gold Chiavari chairs arranged for a outdoor garden reception.',
      category: 'Rentals & Setup',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      title: 'Eru Iyawo Display',
      caption: 'Custom acrylic trunks and luxury wrapped traditional gifts.',
      category: 'Eru Iyawo',
      imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      title: 'Master of Ceremonies Live Stage',
      caption: 'Omolayo Meseko hosting high-energy reception games.',
      category: 'MC Services',
      imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
  ];

  for (const g of galleryItems) {
    await prisma.galleryItem.create({ data: g });
  }

  console.log('Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
