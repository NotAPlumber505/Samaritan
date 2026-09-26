export type Emergency = {
  id: string;
  type: string;
  location: string;
  requestedAt: string;
  description: string;
};

export const emergencies: Emergency[] = [
  {
    id: '1',
    type: 'Medical',
    location: '123 Main Street, Miami, FL 33126',
    requestedAt: 'Today, 10:42 AM',
    description: 'Person experiencing chest pain and shortness of breath.',
  },
  {
    id: '2',
    type: 'Injury',
    location: '860 Ocean Drive, Miami Beach, FL 33139',
    requestedAt: 'Today, 10:28 AM',
    description: 'Cyclist fell and may have an injured leg.',
  },
  {
    id: '3',
    type: 'Medical',
    location: '200 Biscayne Boulevard, Miami, FL 33131',
    requestedAt: 'Today, 9:55 AM',
    description: 'Individual reports dizziness and needs assistance getting home safely.',
  },
  {
    id: '4',
    type: 'Other',
    location: '4100 Salzedo Street, Coral Gables, FL 33146',
    requestedAt: 'Today, 9:41 AM',
    description: 'Caller needs help after a minor vehicle breakdown in a busy parking area.',
  },
];