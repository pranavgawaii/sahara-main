import Cookies from 'js-cookie';
import { User } from '../stores/authStore';

interface GoogleTokenPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

class AuthService {
  // Decode JWT token without verification (for demo purposes)
  // In production, token verification should be done on the server
  private decodeGoogleToken(token: string): GoogleTokenPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decoding failed:', error);
      throw new Error('Invalid Google token');
    }
  }

  private determineUserRole(email: string): 'student' | 'counselor' {
    // Simple role determination logic
    // In a real app, this would be determined by your backend
    if (email.includes('counselor') || email.includes('therapist') || email.includes('admin')) {
      return 'counselor';
    }
    return 'student';
  }

  private generateSimpleToken(payload: any): string {
    // Simple token generation for demo purposes
    // In production, use proper JWT signing on the server
    return btoa(JSON.stringify({
      ...payload,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    }));
  }

  async processGoogleCallback(credential: string): Promise<{
    user: any;
    token: string;
    role: 'student' | 'counselor';
  }> {
    try {
      const googlePayload = this.decodeGoogleToken(credential);
      
      const role = this.determineUserRole(googlePayload.email);
      
      const user = {
        id: googlePayload.sub,
        email: googlePayload.email,
        name: googlePayload.name,
        picture: googlePayload.picture,
        role,
      };
      
      const token = this.generateSimpleToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
      
      return { user, token, role };
    } catch (error) {
      console.error('Google callback handling failed:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;