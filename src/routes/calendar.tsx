import { useState } from 'react';
import { Calendar as BigCalendar } from 'react-big-calendar';
import { dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDrag, useDrop } from 'react-dnd';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const ItemTypes = {
    EVENT: 'event',
};

const Event = ({ event, onDelete }) => {
    const [, ref] = useDrag({
        type: ItemTypes.EVENT,
        item: { id: event.id },
    });

    return (
        <div ref={ref} className='bg-blue-500 text-white p-2 rounded'>
            {event.title}
            <button
                onClick={() => onDelete(event.id)}
                className='ml-2 text-red-500'
            >
                Delete
            </button>
        </div>
    );
};

export default function CalendarPage() {
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Test Appointment',
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 1)),
        },
    ]);

    const handleSelectSlot = ({ start, end }) => {
        const title = window.prompt('New Event name');
        if (title) {
            setEvents((prevEvents) => [
                ...prevEvents,
                {
                    id: prevEvents.length + 1,
                    title,
                    start,
                    end,
                },
            ]);
        }
    };

    const handleEventDrop = ({ event, start, end }) => {
        const updatedEvents = events.map((existingEvent) => {
            if (existingEvent.id === event.id) {
                return { ...existingEvent, start, end };
            }
            return existingEvent;
        });
        setEvents(updatedEvents);
    };

    const handleDeleteEvent = (id) => {
        setEvents(events.filter((event) => event.id !== id));
    };

    return (
        <div className='h-screen p-4'>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor='start'
                endAccessor='end'
                style={{ height: 'calc(100vh - 2rem)' }}
                defaultView='week'
                views={['week', 'day']}
                selectable
                onSelectSlot={handleSelectSlot}
                onEventDrop={handleEventDrop}
                components={{
                    event: (eventProps) => (
                        <Event {...eventProps} onDelete={handleDeleteEvent} />
                    ),
                }}
            />
        </div>
    );
}
