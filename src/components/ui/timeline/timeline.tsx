import React from 'react';

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
}

export interface TimelineProps {
  events: TimelineEvent[];
}

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <ul className="relative border-l-2 border-gray-200">
      {events.map((event) => (
        <li key={event.id} className="mb-8 ml-4">
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 mt-1"></div>
          <time className="block mb-1 text-sm font-normal text-gray-400">
            {event.timestamp}
          </time>
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          {event.description && (
            <p className="mt-1 text-base font-normal text-gray-500">
              {event.description}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Timeline; 