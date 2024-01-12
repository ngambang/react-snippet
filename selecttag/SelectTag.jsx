import React, { useState, useEffect, useRef } from 'react';

const SelectSegmentations = ({ options = [], onSelect = () => {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    console.log(e)
    if (
      e.key === 'Backspace' &&
      searchTerm === '' &&
      selectedOptions.length > 0 
    ) {
      handleRemoveOption(selectedOptions[selectedOptions.length - 1].value);
    }

    const notSelectedOptions = options.filter(
      (option) => !selectedOptions.some((selected) => selected.value === option.value)
    );

    const filtered = notSelectedOptions.filter((option) => option.label.toLowerCase().includes(term));
    setFilteredOptions(filtered);
   
  };

  const handleOpenDropdown = () => {
    setTimeout(() => {
      if (searchTerm === '' && filteredOptions.length === 0) {
        setFilteredOptions(options);
      }
      setDropdownOpen(true);
    }, 50);
  };

  const handleSelect = (option) => {
    handleOpenDropdown();
    if (!selectedOptions.some((selected) => selected.value === option.value)) {
      setSelectedOptions([...selectedOptions, option]);
      onSelect([...selectedOptions, option]);
    }
  };

  const handleRemoveOption = (value) => {
    const updatedOptions = selectedOptions.filter((option) => option.value !== value);
    setSelectedOptions(updatedOptions);
    onSelect(updatedOptions);
  };

  const newOptions = () => {
    if (selectedOptions.length > 0) {
      const newOptions = options.filter((option) => !selectedOptions.some((selected) => selected.value === option.value));
      setFilteredOptions(newOptions);
    }else if(selectedOptions.length === options.length){
      setFilteredOptions([]);
    }else{
      setFilteredOptions(options);
    }
  }  

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropdownRef]);

  useEffect(() => {
    newOptions();
  }, [selectedOptions,options]);

  return (
    <div className='select-segmentations' ref={dropdownRef}>
      <div className={`selected-options ${isDropdownOpen ? 'open' : ''}`} onClick={handleOpenDropdown}>
        {selectedOptions.map((option) => (
          <span key={option.value} className='selected-option' onClick={() => handleRemoveOption(option.value)}>
            {option.label} &times;
          </span>
        ))}
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleSearch}
          onFocus={handleOpenDropdown}
        />
      </div>
      {isDropdownOpen && (
        <ul className='options-dropdown'>
          {filteredOptions.map((option) => (
            <li key={option.value} onClick={() => handleSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectSegmentations;
