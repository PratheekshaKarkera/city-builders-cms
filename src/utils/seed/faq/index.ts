import type { Payload } from 'payload'

export const seedFaqs = async (payload: Payload) => {
  try {
    const existingFaqs = await payload.find({
      collection: 'faq',
      limit: 1,
    })

    if (existingFaqs.docs.length === 0) {
      payload.logger.info('Seeding FAQ Collection...')

      await payload.create({
        collection: 'faq',
        data: {
          title: 'Loans & Advances',
          subTitle: 'Savings and terms deposite help',
          shortDescription: 'Find comprehensive answers about our vehicle, housing, mortgage, education, and MSME loan products.',
          pageHeading: 'Strategic Funding for Your Aspirations.',
          description: 'Explore our detailed guides on various loan products, eligibility criteria, and sanction processes designed to empower your financial journey.',
          slug: 'loans-and-advances',
          faqCategories: [
            {
              category: 'Vehicle Loan (Private)',
              questions: [
                {
                  question: 'Who is eligible for a Vehicle Loan for Private Vehicle?',
                  answer: 'Any person who is gainfully employed or earning income through self-employment, including NREs.',
                },
                {
                  question: 'What is the maximum repayment period for a vehicle loan?',
                  answer: 'The repayment period varies based on whether the vehicle is new or used, typically ranging from 60 to 84 months.',
                },
              ],
            },
            {
              category: 'Housing Loan',
              questions: [
                {
                  question: 'Can I get a loan for renovation of my existing house?',
                  answer: 'Yes, we provide housing loans for construction, purchase, and renovation of residential properties.',
                },
              ],
            },
          ],
        },
      })

      payload.logger.info('FAQ Collection seeded successfully.')
    }
  } catch (error) {
    payload.logger.error('Error seeding FAQ: ' + error)
  }
}
