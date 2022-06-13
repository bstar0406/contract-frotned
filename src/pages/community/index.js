import React, {useState} from 'react';
import {FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Typography} from "@material-ui/core";
import "./form.scss";

export default function Community () {
    const [answer,setAnswer] = useState("")
    const handleChange = (e) => {
        setAnswer(e.target.value)
    }

    return (
        <Paper className="community">
            <Typography variant="h5">
                COMMUNITY
            </Typography>
            <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={answer}
                    onChange={handleChange}
                >
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
            </FormControl>

        </Paper>
    )
}