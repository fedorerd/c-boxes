import { Button } from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";

export const GoHome: FC = () => {

    return (
        <Link to={'/'}>
            <Button variant="contained" color="secondary" size="small">
                Go Home
            </Button>
        </Link>
    )
}