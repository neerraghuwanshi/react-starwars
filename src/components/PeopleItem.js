import React from 'react'

import styles from '../css/PeopleItem.module.css'


function PeopleItem({person}) {

    const { icon, ...personObj } = person

    const peopleItem = Object.keys(personObj).map(
        item => (
            <td key={item} className={styles.td}>
                {typeof(person[item]) !== 'object' ?
                    <p>{person[item]}</p> :
                    person[item].length > 0 ?
                        person[item].map(
                            (listItem, index) => (
                                <p key={index}>{listItem}</p>
                            )
                        ) :
                    <p>Null</p>
                }
            </td>
        )
    )

    return (
        <tr>
            <td className={styles.td}>
                <i
                    className={`fa fa-3x fa-${
                        icon === 'Droid' ?
                            'android' : 
                            icon === 'Human' ?
                                'user-circle' :
                                'question-circle'
                    }`}
                    aria-hidden="true" />
            </td>
            {peopleItem}
        </tr>
    )
}


export default PeopleItem