const rules = [
    {
        field: 'Total_Cost',
        method: 'isNumeric',
        validWhen: true,
        message: 'Pleave enter a number.'
    },
    {
        field: 'Proposed_Year',
        method: 'isNumeric',
        validWhen: true,
        message: 'Pleave enter a number.'
    },
    {
        field: 'Proposed_Year',
        method: 'isEmpty',
        validWhen: false,
        message: 'Pleave provide a proposed year.'
    },
    {
        field: 'Contact_Phone',
        method: 'isEmpty',
        validWhen: false,
        message: 'Pleave provide a phone number.'
    },
    {
        field: 'Contact_Phone',
        method: 'matches',
        args: [/^\d\d\d.\d\d\d.\d\d\d\d$/], // args is an optional array of arguements that will be passed to the validation method
        validWhen: true,
        message: 'The required format is ###.###.####'
    },
    {
        field: 'Contractor_Phone',
        method: 'isEmpty',
        validWhen: false,
        message: 'Pleave provide a phone number.'
    },
    {
        field: 'Contractor_Phone',
        method: 'matches',
        args: [/^\d\d\d.\d\d\d.\d\d\d\d$/], // args is an optional array of arguements that will be passed to the validation method
        validWhen: true,
        message: 'The required format is ###.###.####'
    }/* ,
    {
        field: 'Inspector_Phone',
        method: 'isEmpty',
        validWhen: false,
        message: 'Pleave provide a phone number.'
    },
    {
        field: 'Inspector_Phone',
        method: 'matches',
        args: [/^\\d\d\d.\d\d\d-.\d\d\d\d$/], // args is an optional array of arguements that will be passed to the validation method
        validWhen: true,
        message: 'The required format is ###.###.####'
    } */
]

export default rules