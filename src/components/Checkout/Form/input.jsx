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
                <input value={value ? value : ''} 
                    type={type ||  "text" }
                    onChange={(e) => {this.setState({ visited: true }); action(e.target.value)}} 
                    className={`module__text-input`} placeholder={placeholder}/>
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

export { DropdownInput, TextInput };
export default Input;