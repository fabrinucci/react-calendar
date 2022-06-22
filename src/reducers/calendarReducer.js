import moment from 'moment'
import { types } from '../types/types';

const initialState = {
    events: [
        {
            id: new Date().getTime(), 
            title: 'Google Web Dev Event',
            user: {
              _id: 123, name: 'Nicolas Gomez'
            },
            start: moment().toDate(),
            end: moment().add(2, 'hours').toDate(),
            notes: 'Despertarme temprano'
          }
    ],
    activeEvent: null
}

export const calendarReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case types.eventSetActive:
            return {
                ...state, 
                activeEvent: action.payload
            }

        case types.eventAddNew:
            return {
                ...state, 
                events: [
                    ...state.events,
                    action.payload
                ]
            }

        case types.eventClearActive:
            return {
                ...state, 
                activeEvent: null
            }

        case types.eventUpdated:
            return {
                ...state,
                events: state.events.map(
                    e => e.id === action.payload.id ? action.payload : e
                )
            }
        
        case types.eventDeleted:
            return {
                ...state,
                events: state.events.filter(
                    e => ( e.id !== state.activeEvent.id )
                ),
                activeEvent: null
            }

        default:
            return state;
    }
}