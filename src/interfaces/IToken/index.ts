// {
//     error: false,
//     decoded: {
//       email: 'touqeershah1@gmail.com',
//       username: 'touqeershah11',
//       _id: 0,
//       session: '8Ap4h0dXfN6ZejqFj0MUIpkJCMqOBBlT',
//       iat: 1693825643
//     }
//   }

export interface IResetTokenReturn {
    resetToken: string;
    error: boolean;
}

export interface IDecodedReset {
    user: { id: string };
    iat: number;
    exp: number;
}
export interface IToken {
    // Define your configuration properties here
    error: Boolean,
    decoded: Decoded |undefined
    message?: string

}

export interface Decoded {
    // Define your configuration properties here
    email: string,
    username: string,
    _id: number,
    session: string,
    iat: number
}

