import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-modal';
import Swal from 'sweetalert2';

import { customStyles } from '../../helpers/custom-styles';

import '../../styles/modal.css'
import { uiCloseModal } from '../../actions/ui';
import { eventClearActive, eventAddNew, eventUpdated } from '../../actions/events';

Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowEnd = now.clone().add(1,'hours');

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: now.toDate()
}

export const CalendarModal = () => {

    const dispatch = useDispatch();

    const { modalOpen } = useSelector( state => state.ui );
    const { activeEvent } = useSelector( state => state.calendar );

    const [dateStart, setDateStart] = useState( now.toDate() );
    const [dateEnd, setDateEnd] = useState( nowEnd.toDate() );

    const [titleValid, setTitleValid] = useState(true);

    const [formValues, setFormValues] = useState( initEvent );

    const { title, notes, start, end } = formValues;

    useEffect(() => {
        if( activeEvent ) {
            setFormValues( activeEvent )
        } else {
            setFormValues( initEvent )
        }
    }, [activeEvent, setFormValues])
    

    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name] : target.value
        })
    }

    const closeModal = () => {
        dispatch( uiCloseModal() )
        dispatch( eventClearActive() )
        setFormValues( initEvent )
    }

    const handleStartDateChange = e => {
        setDateStart(e)
        setFormValues({
            ...formValues,
            start: e
        })
    }

    const handleEndDateChange = e => {
        setDateEnd(e)
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = e => {
        e.preventDefault();

        const momentStart = moment( start );
        const momentEnd = moment( end );

        if( momentStart.isSameOrAfter( momentEnd ) ) {
            return Swal.fire('Error', 'La fecha fin debe ser mayor a la fecha inicio', 'error');
        }

        if( title.trim().length < 2 ) {
            return setTitleValid(false);
        }

        // Todo: Add event

        if( activeEvent ) {
            dispatch( eventUpdated(formValues) );
        } else {
            dispatch( eventAddNew({
                ...formValues,
                id: new Date().getTime(),
                user: {
                    _id: '123',
                    name: 'Kike'
                }
            }) );
        }


        setTitleValid(true);
        closeModal();

    }

  return (
    <div>
        <Modal
            isOpen={ modalOpen }
            onRequestClose={ closeModal }
            style={ customStyles }
            closeTimeoutMS={ 200 }
            className="modal"
            overlayClassName="modal-background"
        > 
            <h1>{ activeEvent ? 'Editar Evento' : 'Nuevo Evento'}</h1>
            
            <hr />
            <form 
                className="container"
                onSubmit={ handleSubmitForm }
            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker 
                        onChange={ handleStartDateChange } 
                        value={ dateStart } 
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker 
                        onChange={ handleEndDateChange } 
                        value={ dateEnd } 
                        minDate={ dateStart }
                        className="form-control"
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={`form-control ${ !titleValid && 'is-invalid' }`}
                        placeholder="T??tulo del evento"
                        name="title"
                        autoComplete="off"
                        value={ title }
                        onChange={ handleInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripci??n corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={ notes }
                        onChange={ handleInputChange }
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Informaci??n adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar </span>
                </button>

            </form>
        </Modal>
    </div>
  )
}