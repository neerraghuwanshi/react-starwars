import React from 'react'

import styles from '../css/PeopleItem.module.css'


function PeopleItemHeading({headings}) {

    headings.pop()

    const peopleItem = headings.map(
        heading => (
            <th key={heading} className={styles.td}>
                {heading}
            </th>
        )
    )

    return (
        <tr>
            <th className={styles.td}>
                Icon
            </th>
            {peopleItem}
        </tr>
    )
}


export default React.memo(PeopleItemHeading)