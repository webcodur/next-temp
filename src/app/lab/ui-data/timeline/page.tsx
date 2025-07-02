import React from 'react';
import Timeline, { TimelineEvent } from '@/components/ui/ui-data/timeline/Timeline';

const sampleEvents: TimelineEvent[] = [
  { id: '1', timestamp: '2025-01-01', title: 'Event One', description: 'Description for event one' },
  { id: '2', timestamp: '2025-02-01', title: 'Event Two', description: 'Description for event two' },
  { id: '3', timestamp: '2025-03-01', title: 'Event Three', description: 'Description for event three' },
];

const TimelinePage: React.FC = () => {
  return (
    <Timeline events={sampleEvents} />
  );
};

export default TimelinePage; 