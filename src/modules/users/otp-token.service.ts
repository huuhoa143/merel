import { Injectable, Logger } from '@nestjs/common';
import * as otplib from 'otplib';
import * as qrcode from 'qrcode';

const { authenticator } = otplib;

@Injectable()
export class OtpTokenService {
  private readonly logger = new Logger('OTP SERVICE');

  generateUniqueSecret() {
    return authenticator.generateSecret();
  }

  generateOTPToken(merchantname: string, serviceName: string, secret: string) {
    return authenticator.keyuri(merchantname, serviceName, secret);
  }

  verifyOTPToken(token: string, secret: string) {
    return authenticator.verify({ token, secret });
  }

  async generateQRCode(otpAuth: string) {
    return qrcode.toDataURL(otpAuth);
  }

  generateOtpCode() {
    return Math.random().toFixed(6).substr(-6);
  }
}
