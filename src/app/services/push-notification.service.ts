import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { switchMap, startWith } from 'rxjs/operators';

export interface Notification {
  id: number;
  tipo: 'pedido' | 'comanda';
  acao: 'confirmado' | 'cancelado' | 'preparando' | 'entregue' | 'fechada';
  mensagem: string;
  timestamp: string;
  lida: boolean;
  comanda_id?: number;
  pedido_id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService extends BaseService {
  private apiUrl = this.urlServiceV1;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private pollingInterval = 5000; // 5 seconds
  private isPolling = false;

  constructor(private http: HttpClient) {
    super();
    this.startPolling();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return new Observable(observer => {
      this.notificationsSubject.subscribe(notifications => {
        const unreadCount = notifications.filter(n => !n.lida).length;
        observer.next(unreadCount);
      });
    });
  }

  // Start polling for new notifications
  private startPolling(): void {
    if (this.isPolling) return;

    this.isPolling = true;
    interval(this.pollingInterval)
      .pipe(
        startWith(0),
        switchMap(() => this.fetchNotifications())
      )
      .subscribe(
        (notifications) => {
          this.notificationsSubject.next(notifications);
        },
        (error) => {
          console.error('Error fetching notifications:', error);
        }
      );
  }

  // Fetch notifications from server
  private fetchNotifications(): Observable<Notification[]> {
    const comandaId = this.getCurrentComandaId();
    if (!comandaId) {
      return new Observable(observer => observer.next([]));
    }

    return this.http.get<Notification[]>(
      `${this.apiUrl}/notificacoes.php?comanda_id=${comandaId}`,
      this.ObterAuthHeaderJson()
    );
  }

  // Mark notification as read
  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/notificacoes.php`,
      { id: notificationId, lida: true },
      this.ObterAuthHeaderJson()
    );
  }

  // Mark all notifications as read
  markAllAsRead(): Observable<any> {
    const comandaId = this.getCurrentComandaId();
    if (!comandaId) {
      return new Observable(observer => observer.next({}));
    }

    return this.http.put(
      `${this.apiUrl}/notificacoes.php`,
      { comanda_id: comandaId, marcar_todas_lidas: true },
      this.ObterAuthHeaderJson()
    );
  }

  // Create a new notification (for testing or manual creation)
  createNotification(notification: Partial<Notification>): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/notificacoes.php`,
      notification,
      this.ObterAuthHeaderJson()
    );
  }

  // Get current comanda ID from session storage
  private getCurrentComandaId(): number | null {
    const comandaStr = sessionStorage.getItem('comanda');
    if (comandaStr) {
      try {
        const comandaObj = JSON.parse(comandaStr);
        return comandaObj.comanda_id || comandaObj.id || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  // Stop polling (useful when user logs out)
  stopPolling(): void {
    this.isPolling = false;
  }

  // Resume polling (useful when user logs in)
  resumePolling(): void {
    this.startPolling();
  }
}
