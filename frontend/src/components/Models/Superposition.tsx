import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    Button, Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem, Table, TableBody, TableCell,
    TableHead, TableRow,
    TextField
} from "@material-ui/core";

interface Channel {
    name: string
}

const useStyles = makeStyles((theme) => ({
    footer: {
        padding: theme.spacing(6, 0),
    }
}));

export default function Superposition(props: any) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [names, setNames] = React.useState<string>()
    const [args, setArgs] = React.useState<string>()
    const [argsNames, setArgsNames] = React.useState<string>()


    const handleCloseDialog = () => {
        setOpenSuperPositions(false)
    };

    const handleClick = () => {
        setOpenSuperPositions(true)
    };

    const [openSuperPositions, setOpenSuperPositions] = React.useState(false);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [checked, setChecked] = React.useState(true);

    function getSuperPositionModel() {
        setOpenSuperPositions(false)
    }

    const handleChangeNames = (event: React.ChangeEvent<HTMLInputElement>) => {
        let tmp_names: any[] = []

        if (names !== undefined && names.split(';').length > 0) {
            tmp_names = names.split(';')
        }

        const name = event.target.id.toString()

        if (tmp_names.includes(name)) {
            tmp_names = tmp_names.filter(channel => channel !== name)
            setNames(tmp_names.join(';'))
            return
        }
        tmp_names.push(name)
        setNames(tmp_names.join(';'))
    };

    const handleChangeArguments = (event: React.ChangeEvent<HTMLInputElement>) => {
        let tmp_arguments: any[] = []
        let tmp_names: any[] = []

        const arg = event.target.value.toString()
        const name = event.target.id.toString()

        if (argsNames !== undefined && argsNames.split(';').length > 1 && args !== undefined) {
            tmp_names = argsNames.split(';')
            tmp_arguments = args.split(';')
            if (tmp_names.includes(name)) {

            }
        } else {
            tmp_names.push(name)
            tmp_arguments.push(arg)
        }
        console.log(tmp_names, tmp_arguments)

        setArgs(tmp_arguments.join(';'))
        setArgsNames(tmp_names.join(';'))
    }

    console.log(args, argsNames)

    return (
        <>
            <MenuItem onClick={handleClick}>Суперпозиция каналов</MenuItem>

            <Dialog open={openSuperPositions} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Создание нового сигнала</DialogTitle>
                <DialogContent>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Имя сигнала</TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align="center">Параметр</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.channelsFile ? (props.channelsFile.map((channel: string) => (
                                <TableRow key={channel}>
                                    <TableCell component="th" scope="row">
                                        {channel}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            id={channel}
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                            onChange={handleChangeNames}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            id={channel}
                                            style={{marginRight: '10px'}}
                                            autoFocus
                                            margin="dense"
                                            variant='outlined'
                                            type="number"
                                            onChange={handleChangeArguments}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))) : (<></>)}
                            {JSON.parse(localStorage.getItem('models') as string) ? (JSON.parse(localStorage.getItem('models') as string).map((channel: Channel) => (
                                <TableRow key={channel.name}>
                                    <TableCell component="th" scope="row">
                                        {channel.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            color="primary"
                                            inputProps={{'aria-label': 'secondary checkbox'}}
                                            onChange={handleChangeNames}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            style={{marginRight: '10px'}}
                                            autoFocus
                                            margin="dense"
                                            variant='outlined'
                                            type="number"
                                            onChange={handleChangeArguments}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))) : (<></>)}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={getSuperPositionModel} color="primary">
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
