import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Interfaz que define la estructura de una tarea agendada
 * @interface ScheduledTask
 */
export interface ScheduledTask {
    /** ID único de la tarea */
    taskId: number;
    /** Nombre de la tarea */
    taskName: string;
    /** Hora programada en formato HH:mm */
    scheduledTime: string;
    /** Estado de la tarea (actualmente solo 'scheduled') */
    status: 'scheduled';
}

/**
 * Servicio que maneja el almacenamiento y gestión de tareas agendadas
 * Utiliza localStorage para persistencia y BehaviorSubject para estado reactivo (de momento)
 */
@Injectable({
    providedIn: 'root'
})
export class ScheduledTasksService {
    /** BehaviorSubject que mantiene el estado actual de las tareas agendadas */
    private scheduledTasks = new BehaviorSubject<ScheduledTask[]>([]);

    constructor() {
        // Cargar tareas almacenadas al iniciar el servicio
        this.loadScheduledTasks();
    }

    /**
     * Carga las tareas agendadas desde el localStorage
     * Se ejecuta al iniciar el servicio
     * @private
     */
    private loadScheduledTasks() {
        const storedTasks = localStorage.getItem('scheduledTasks');
        if (storedTasks) {
            this.scheduledTasks.next(JSON.parse(storedTasks));
        }
    }

    /**
     * Guarda las tareas en localStorage y actualiza el estado
     * @private
     * @param tasks - Array de tareas agendadas a guardar
     */
    private saveScheduledTasks(tasks: ScheduledTask[]) {
        localStorage.setItem('scheduledTasks', JSON.stringify(tasks));
        this.scheduledTasks.next(tasks);
    }

    /**
     * Obtiene un Observable de las tareas agendadas
     * @returns Observable que emite el array de tareas agendadas
     */
    getScheduledTasks(): Observable<ScheduledTask[]> {
        return this.scheduledTasks.asObservable();
    }

    /**
     * Agrega una nueva tarea agendada
     * @param task - Tarea a agendar
     */
    addScheduledTask(task: ScheduledTask) {
        const currentTasks = this.scheduledTasks.value;
        this.saveScheduledTasks([...currentTasks, task]);
    }

    /**
     * Elimina una tarea agendada por su ID
     * @param taskId - ID de la tarea a eliminar
     */
    removeScheduledTask(taskId: number) {
        const currentTasks = this.scheduledTasks.value;
        this.saveScheduledTasks(currentTasks.filter(task => task.taskId !== taskId));
    }

    /**
     * Obtiene las tareas agendadas para una hora específica
     * @param time - Hora en formato HH:mm
     * @returns Array de tareas agendadas para la hora especificada
     */
    getTasksForTime(time: string): ScheduledTask[] {
        return this.scheduledTasks.value.filter(task => task.scheduledTime === time);
    }
} 