import type { Payload } from 'payload'

export const seedEnquirySettings = async (payload: Payload) => {
  try {
    const settings = await payload.findGlobal({
      slug: 'enquiry-settings',
    })

    // If email is not set, we assume it's the first run or empty
    if (!settings.email) {
      payload.logger.info('Seeding Enquiry Settings...')
      await payload.updateGlobal({
        slug: 'enquiry-settings',
        data: {
          email: 'info@citybuilders.com',
          countryCode: '91',
          phone: '1234567890',
          telephoneNumber: '1800 123 2966',
          address: {
            line1: '14-6-685, 686, City Builders Building',
            line2: 'St. Aloysius College Road',
            area: 'Hampankatta',
            city: 'Mangalore',
            state: 'Karnataka',
            pincode: '575001',
          },
          links: [
            {
              platformName: 'Facebook',
              url: 'https://facebook.com/citybuilders',
              iconName: 'facebook',
            },
            {
              platformName: 'Instagram',
              url: 'https://instagram.com/citybuilders',
              iconName: 'instagram',
            },
            {
              platformName: 'LinkedIn',
              url: 'https://linkedin.com/company/citybuilders',
              iconName: 'linkedin',
            },
            {
              platformName: 'YouTube',
              url: 'https://youtube.com/citybuilders',
              iconName: 'youtube',
            },
          ],
        },
      })
      payload.logger.info('Enquiry Settings seeded successfully.')
    }
  } catch (error) {
    payload.logger.error('Error seeding Enquiry Settings:' + error)
  }
}
