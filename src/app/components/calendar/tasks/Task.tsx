import React, { RefObject } from 'react';
import TaskForm, { TaskFormEditable, TaskFormType } from './TaskForm';
import {
  createConfirmModal,
  createInfoModal,
} from '../../../generic/overlays/modals';
import {
  createToastEvent,
  ToastAlertType,
} from '../../../generic/overlays/toasts';

export type TaskCheckbox = {
  id: number;
  label: string;
  bool: boolean;
};

export type TaskData = {
  id: string;
  dueDate: Date;
  name: string;
  description: string;
  checkboxes: TaskCheckbox[];
  editables: TaskFormEditable;
  classId: number | null;
};

export type TaskState = {
  data: TaskData;
};

type TaskProps = {
  data: TaskData;
  setStateTasks: () => void;
};

export function ClientTask(props: TaskProps) {
  async function handleDelete() {
    const res = await fetch('/api/calendar/tasks', {
      method: 'DELETE',
      body: JSON.stringify({ id: props.data.id }),
    });

    const resText = await res.text();
    if (res.status != 200 || resText !== '') {
      createInfoModal(
        'Error ' + res.status + ': ' + resText,
        <p>{'There was an issue with deleting "' + '."'}</p>
      );
    } else {
      createToastEvent(
        ToastAlertType.SUCCESS,
        '"' + '" was successfully deleted.'
      );
      props.setStateTasks();
    }
  }

  async function handleSubmit(
    nameRef: RefObject<HTMLInputElement | null>,
    descRef: RefObject<HTMLInputElement | null>,
    dueDate: Date,
    checklist: TaskCheckbox[]
  ): Promise<boolean> {
    const name = nameRef.current?.value;
    const description = descRef.current?.value;

    if (name === '') {
      return false;
    }

    // if (
    //   name != props.data.name ||
    //   description != props.data.description ||
    //   dueDate.getTime() != new Date(props.data.dueDate).getTime()
    // ) {
    const res = await fetch('/api/calendar/tasks', {
      method: 'POST',
      body: JSON.stringify({
        id: props.data.id,
        name: name,
        description: description,
        dueDate: dueDate,
        checkboxes: checklist,
      }),
    });
    const resText = await res.text();
    if (res.status != 200 || resText !== '') {
      createInfoModal(
        'Error ' + res.status + ': ' + resText,
        <p>{'There was an issue with editing "' + props.data.name + '."'}</p>
      );
    } else {
      createToastEvent(
        ToastAlertType.SUCCESS,
        '"' + props.data.name + '" was successfully edited.'
      );
      props.setStateTasks();
    }
    // }
    return true;
  }

  const event = new CustomEvent('add-modal', {
    detail: {
      body: (
        <TaskForm
          key={props.data.id}
          data={{ ...props.data, dueDate: new Date(props.data.dueDate) }}
          type={TaskFormType.CLIENT_EDIT}
          onClose={() => {}}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      ),
    },
  });

  return (
    <div className="calendar-item">
      <button
        className={'task-label'}
        onClick={() => document.dispatchEvent(event)}
      >
        {props.data.name}
      </button>
    </div>
  );
}

export function ClassTask(props: TaskProps) {
  async function handleDelete() {
    const res = await fetch('/api/classes/tasks', {
      method: 'DELETE',
      body: JSON.stringify({
        classId: props.data.classId,
        taskName: props.data.name,
      }),
    });

    const resText = await res.text();
    if (res.status != 200 || resText !== '') {
      createInfoModal(
        'Error ' + res.status + ': ' + resText,
        <p>
          {'There was an issue with deleting "' +
            props.data.name +
            '" for the class.'}
        </p>
      );
    } else {
      createToastEvent(
        ToastAlertType.SUCCESS,
        '"' + props.data.name + '" was successfully deleted for the class.'
      );
      props.setStateTasks();
    }
  }

  async function handleSubmit(
    nameRef: RefObject<HTMLInputElement | null>,
    descRef: RefObject<HTMLInputElement | null>,
    dueDate: Date,
    checklist: TaskCheckbox[]
  ): Promise<boolean> {
    const name = nameRef.current?.value;
    const description = descRef.current?.value;

    if (name === '') {
      return false;
    }

    /* Client Edit */
    // if (checklist !== props.data.checkboxes) {
    const res = await fetch('/api/calendar/tasks', {
      method: 'POST',
      body: JSON.stringify({
        id: props.data.id,
        name: props.data.name,
        description: props.data.description,
        dueDate: props.data.dueDate,
        checkboxes: checklist,
      }),
    });

    const resText = await res.text();
    if (res.status != 200 || resText !== '') {
      createInfoModal(
        'Error ' + res.status + ': ' + resText,
        <p>
          {'There was an issue with editing the checklist on "' +
            props.data.name +
            '."'}
        </p>
      );
    } else {
      createToastEvent(
        ToastAlertType.SUCCESS,
        '"' + props.data.name + '" checklist was successfully updated.'
      );
      props.setStateTasks();
    }
    // }

    /* Admin Edit */
    if (typeof name == 'undefined') {
      return true;
    }

    if (
      name != props.data.name ||
      description != props.data.description ||
      dueDate.getTime() != new Date(props.data.dueDate).getTime()
    ) {
      createConfirmModal(
        <p>
          {'You are about to edit "' +
            props.data.name +
            '" for a class, meaning that this task will also be edited for users.  Do you wish to continue?'}
        </p>,
        async () => {
          const res = await fetch('/api/classes/tasks', {
            method: 'POST',
            body: JSON.stringify({
              taskId: props.data.id,
              classId: props.data.classId,
              oldName: props.data.name,
              newName: name,
              description: description,
              dueDate: dueDate,
              checkboxes: checklist,
            }),
          });
          const resText = await res.text();
          if (res.status != 200 || resText !== '') {
            createInfoModal(
              'Error ' + res.status + ': ' + resText,
              <p>
                {'There was an issue with editing "' +
                  props.data.name +
                  '" for the class.'}
              </p>
            );
          } else {
            createToastEvent(
              ToastAlertType.SUCCESS,
              '"' + props.data.name + '" was successfully edited for the class.'
            );
            props.setStateTasks();
          }
        }
      );
    }
    return true;
  }

  const event = new CustomEvent('add-modal', {
    detail: {
      body: (
        <TaskForm
          key={props.data.id}
          data={{ ...props.data, dueDate: new Date(props.data.dueDate) }}
          type={TaskFormType.ADMIN_EDIT}
          onClose={() => {}}
          onSubmit={handleSubmit}
          onDelete={() => {
            createConfirmModal(
              <p>
                {'You are about to delete "' +
                  props.data.name +
                  '" for a class, meaning that this task will also be deleted for users.  Do you wish to continue?'}
              </p>,
              handleDelete
            );
          }}
        />
      ),
    },
  });

  return (
    <div className="calendar-item">
      <button
        className={'task-label'}
        onClick={() => document.dispatchEvent(event)}
      >
        {props.data.name}
      </button>
    </div>
  );
}
