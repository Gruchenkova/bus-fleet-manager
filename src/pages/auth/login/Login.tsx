import { Typography, TextField, Grid, Box, Button } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { loginAsync, selectUser } from '../../../sharedSlices/UserSlice';
import { useNavigate } from 'react-router-dom';

type LoginModel = {
    login: string;
    password: string;
}

export function Login() {
    const { control, handleSubmit, formState } = useForm<LoginModel>({
        mode: "onChange"
    });

    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUser);

    const navigate = useNavigate();

    if (userData.authorized) {
        navigate('/dashboard');
    }

    const onSubmit = (data: LoginModel) => {
        dispatch(loginAsync(data));
    };

    return (
        <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
            <Grid item xs={3}>
                <Typography variant="h6" component="h2">
                    Вход в приложение
                </Typography>

                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="login"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <div>
                                    <TextField variant="outlined" label="Логин" {...field} />
                                    {formState.errors.login && <span>Заполните поле</span>}
                                </div>
                            )}
                            rules={{ required: true }}
                        />

                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <div>
                                    <TextField sx={{ mt: 2}} variant="outlined" label="Пароль" type="password" {...field} />
                                    {formState.errors.password && <span>Заполните поле</span>}
                                </div>
                            )}
                            rules={{ required: true }}
                        />

                        <Box sx={{ mt: 2 }}>
                            <Button type="submit" disabled={!formState.isValid} variant="outlined">Вход</Button>
                        </Box>
                    </form>
                </Typography>
            </Grid>
        </Grid>
    );
}