import React, {useState, useEffect, Fragment} from "react";

const Radiobox = ({prices, handleFilters}) => {
    const [value, setValue] = useState(0)

    const handleChange = (e) => {
        handleFilters(e.target.value)
        setValue(e.target.value)
    }

    return prices.map((p, i) => (
        <div key={i}>
            <input onChange={handleChange} value={`${p._id}`} name={p} type='radio' className="mr-2 ml-2" />
            <label className="form-check-label">{p.name}</label>
        </div>
    ))
}

export default Radiobox