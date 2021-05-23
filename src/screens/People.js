import React, { useState } from 'react'
import PeopleList from '../components/PeopleList'
import styles from '../css/People.module.css'


function People() {

    const [inputValue, setInputValue] = useState('')

    return (
        <>
            <input
                placeholder='Search...'
                className={styles.input} 
                value={inputValue}
                onChange={
                    event => setInputValue(event.target.value)
                }/>
            <PeopleList 
                inputValue={inputValue}/>
        </>
    )
}


export default People