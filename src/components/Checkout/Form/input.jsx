import React from 'react';
import Select from 'react-select';

const Element = ({children, size, valid={ valid: true }, visited, extraClass}) => {
    const isValid = valid.valid || !visited;
    return (
        <div className='module__input-group'>
            <div className={`module__input-container module__input--${size}  ${!isValid ? 'module__input-container--invalid' : ''} ${extraClass ? extraClass : ''}`}>
                {children}
            </div>
            { !isValid ?
            <div className="module__input-errors">
                {valid.messages.map(m => <span key={m}>{m}</span>)}
            </div> : null }
        </div>
    );
};

class DropdownInput extends React.PureComponent {
    state = {
        visited: false
    }
    render () {
        const {size, value, placeholder, options, valid, forceValidation, disabled, action, defaultValue} = this.props;
        return (
            <Element size={size} 
                valid={valid} visited={this.state.visited || forceValidation}
                extraClass="checkout-select--nopadding">                
                <Select
                    name={placeholder} 
                    defaultValue={defaultValue}
                    className="checkout-select"
                    classNamePrefix="checkout-select"
                    isDisabled={disabled}
                    placeholder={placeholder}
                    controlShouldRenderValue={options && options.length && value !== null}
                    selectedOption={value}
                    options={options || []} 
                    onChange={(opt) => {this.setState({ visited: true }); action(opt.value, opt.label)}}
                    theme={(defaultTheme) => {
                        return {...defaultTheme, colors: { ...defaultTheme.colors, primary: '#d32027', primary25: 'rgba(211, 32, 3, .25)' } };
                    }} />
            </Element>
        )
    }
}

class TextInput extends React.PureComponent {
    state = {
        visited: false
    }
    render () {
        const {size, placeholder, value, action, valid, forceValidation, type} = this.props;
        return (
            <Element size={size} valid={valid} visited={this.state.visited || forceValidation}>
                <input name={placeholder} value={value ? value : ''} 
                    type={type ||  "text" }
                    onChange={(e) => {this.setState({ visited: true }); action(e.target.value)}} 
                    className={`module__text-input`} placeholder={placeholder}/>
            </Element>
        )
    }
}

class DropdownDate extends React.PureComponent{
    state ={
        dayVisited:false,
        monthVisited:false,
        yearVisited:false,
        day:'',
        month:'',
        year:'',
    }
   setMonth = (value)=>{
       this.setState({day:value})
   }
   setYear = (value)=>{
       this.setState({month:value})
   }
   setDay = (value)=>{
       this.setState({year:value})
   }
    getDate(){
       return this.state.year && this.state.month && this.state.day?'123123':null
    }

    render(){
    const { days,months,years, size, placeholder,defaultValue,disabled, value,  valid, forceValidation, type,actionDay,actionMonth,actionYear} = this.props;
    return(
        <Element size='large' 
            valid={valid} visited={(this.state.dayVisited && this.state.monthVisited && this.state.yearVisited ) || forceValidation}
            extraClass="checkout-select--nopadding">                
            <Select
                defaultValue={defaultValue}
                className="checkout-select"
                classNamePrefix="checkout-select"
                isDisabled={disabled}
                placeholder='Dia'
                controlShouldRenderValue={days && days.length && value !== null}
                selectedOption={value}
                options={days} 
                onChange={(opt) => { this.setState({ dayVisited: true,day:opt.value }); actionDay(opt.value)}}
                theme={(defaultTheme) => {
                    return {...defaultTheme, colors: { ...defaultTheme.colors, primary: '#d32027', primary25: 'rgba(211, 32, 3, .25)' } };
                }} />
            <Select
                defaultValue={defaultValue}
                className="checkout-select"
                classNamePrefix="checkout-select"
                isDisabled={disabled}
                placeholder='Mes'
                controlShouldRenderValue={months && months.length && value !== null}
                selectedOption={value}
                options={months} 
                onChange={(opt) => {this.setState({ monthVisited: true,month:opt.value });actionMonth(opt.value)}}
                theme={(defaultTheme) => {
                    return {...defaultTheme, colors: { ...defaultTheme.colors, primary: '#d32027', primary25: 'rgba(211, 32, 3, .25)' } };
                }} />
            <Select
                defaultValue={defaultValue}
                className="checkout-select"
                classNamePrefix="checkout-select"
                isDisabled={disabled}
                placeholder='Año'
                controlShouldRenderValue={years && years.length && value !== null}
                selectedOption={value}
                options={years} 
                onChange={(opt) => {this.setState({ yearVisited: true,year:opt.value });  actionYear(opt.value)}}
                theme={(defaultTheme) => {
                    return {...defaultTheme, colors: { ...defaultTheme.colors, primary: '#d32027', primary25: 'rgba(211, 32, 3, .25)' } };
                }} />
        </Element>
    )
}
}

class Input extends React.Component {
    render() {
        const {children, title} = this.props;
        return (
            <div className="module__input">
                {title ? <div className="module__input--title">{title}</div> : null}
                {children.length > 1 ? 
                <div className="module__compound-input">
                    {children}
                </div> : children}
            </div>
        );
    }
}

export { DropdownInput, TextInput, DropdownDate };
export default Input;