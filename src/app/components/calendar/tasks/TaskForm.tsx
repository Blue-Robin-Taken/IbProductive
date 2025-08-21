import '../calendar.css';
import { TaskData, TaskCheckbox } from './Task';
import './tasks.css';
import {
  FormEvent,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ClassData } from '@/db/classes/class';
import {
  createConfirmModal,
  createInfoModal,
} from '../../../generic/overlays/modals';
import TaskDueCountdown from './TaskDueDate';
import { dateAsDateTimeLocalValue } from '../../../generic/time/time';
import {
  createToastEvent,
  ToastAlertType,
} from '../../../generic/overlays/toasts';

export type TaskFormEditable = {
  nameEditable: boolean;
  descEditable: boolean;
  dueEditable: boolean;
  deletable: boolean;
};

type TaskFormProps = {
  data: TaskData;
  type: TaskFormType;
  onClose: () => void;
  onSubmit: (
    ref: RefObject<HTMLInputElement>,
    descRef: RefObject<HTMLInputElement>,
    dueDate: Date,
    checkboxes: TaskCheckbox[],
    classRef: RefObject<HTMLSelectElement>
  ) => Promise<boolean>; // name, desc, dueDate, checklists, classId (sometimes), oldName (sometimes)
  onDelete: () => void;
};

export enum TaskFormType {
  CLIENT_CREATE,
  CLIENT_EDIT,

  ADMIN_CREATE,
  ADMIN_EDIT,
}

export default function TaskForm(props: TaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isAdminType: boolean = checkIfAdminType(props.type);
  const [isUserAdmin, setUserAdmin] = useState<boolean>(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLInputElement | null>(null);
  // const dueRef = useRef<HTMLInputElement | null>(null);
  const [dueDate, setDueDate] = useState<Date>(props.data.dueDate);
  const [checkboxes, setCheckboxes] = useState<TaskCheckbox[]>(
    props.data.checkboxes
  );
  const classRef = useRef<HTMLSelectElement | null>(null);

  const [classId, setClassId] = useState<string>(String(props.data.classId)); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [className, setClassName] = useState<string>('Loading...');
  const [classes, setClasses] = useState<ReactElement[]>();

  function submit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    const validSubmit = props.onSubmit(
      nameRef,
      descRef,
      dueDate,
      checkboxes,
      classRef
    );

    if (validSubmit) {
      const closeEvent = new Event('close-modal');
      document.dispatchEvent(closeEvent);
    }
  }

  useEffect(() => {
    fetch('/api/auth/admin?')
      .then((res) => {
        return res.json();
      })
      .then((resJson: { isAdmin: boolean }) => {
        setUserAdmin(resJson.isAdmin);
      });

    /* Get from cache if exists */
    const locClasses: string = String(localStorage.getItem('classesList'));
    if (locClasses != 'null') {
      setClasses(
        JSON.parse(locClasses).arr.map((i: ClassData) => {
          if (i.id == props.data.classId) {
            setClassName(i.name);
          }
          return (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          );
        })
      );
    }

    return () => {};
  }, []);

  let nextId: number =
    checkboxes.length === 0 ? 1 : checkboxes[checkboxes.length - 1].id + 1;

  return (
    <div
      className="modal-box max-w-full"
      onKeyDown={(e) => {
        if (e.key == 'Enter') {
          e.preventDefault();
          formRef.current?.requestSubmit();
        }
      }}
    >
      <form ref={formRef} id="taskform" onSubmit={submit}>
        {/* Name */}
        {(isAdminType && isUserAdmin) || props.data.editables.nameEditable ? (
          <>
            <input
              className="input input-xl validator"
              type="text"
              id="taskName"
              name="taskName"
              defaultValue={props.data.name}
              placeholder="Task Name"
              minLength={1}
              ref={nameRef}
              required
            />
            <p className="validator-hint">Please name your task.</p>
          </>
        ) : (
          <h1>{props.data.name}</h1>
        )}

        <div className="grid grid-cols-[15%_auto] gap-y-5 my-5">
          {/* Due Date */}
          <label className="task-form-label">Due Date:</label>
          <div className="inline-flex">
            {(isAdminType && isUserAdmin) ||
            props.data.editables.dueEditable ? (
              <input
                className="input input-xl"
                type="datetime-local"
                id="dueDate"
                defaultValue={dateAsDateTimeLocalValue(props.data.dueDate)}
                onChange={(e) => {
                  e.preventDefault();
                  setDueDate(new Date(e.currentTarget.value));
                }}
                required
              />
            ) : null}
            {isCreatingType(props.type) ? null : (
              <TaskDueCountdown due={dueDate} />
            )}
          </div>

          {/* Class */}
          {isAdminType ? (
            <label className="task-form-label">Class:</label>
          ) : null}
          {isAdminType && isUserAdmin ? (
            <div>
              <select
                ref={classRef}
                className="select select-xl"
                defaultValue={props.data.classId ? props.data.classId : 'None'}
                onChange={(e) => setClassId(e.currentTarget.value)}
                required
              >
                <option value={'None'}>None</option>
                {classes}
              </select>
              <p className="validator-hint">Please choose a class.</p>
            </div>
          ) : null}
          {isAdminType && !isUserAdmin ? <p>{className}</p> : null}

          {/* Description */}
          <label className="task-form-label">Description:</label>
          {(isAdminType && isUserAdmin) || props.data.editables.descEditable ? (
            <input
              className="input input-xl"
              type="text"
              id="description"
              name="description"
              defaultValue={props.data.description}
              placeholder="No Description"
              ref={descRef}
            />
          ) : (
            <p>
              {props.data.description === ''
                ? 'No description provided'
                : props.data.description}
            </p>
          )}

          {/* Checklist */}
          <label className="task-form-label">Checklist:</label>
          <div>
            {checkboxes.map((i) => (
              <div className="my-2" key={String(i.id)}>
                <input
                  className="checkbox mr-3"
                  id={i.id + '-box'}
                  type="checkbox"
                  defaultChecked={Boolean(i.bool)}
                  onChange={() => (i.bool = !i.bool)}
                />
                <input
                  id={i.id + '-label'}
                  className="input mr-3"
                  type="text"
                  defaultValue={String(i.label)}
                  placeholder="New Checkbox"
                  onChange={(e) => {
                    // e.preventDefault();
                    i.label = e.currentTarget.value;
                  }}
                />
                <button
                  className="btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setCheckboxes(checkboxes.filter((j) => j.id !== i.id));
                    // filters the checkboxes to add all that do not have the same label
                  }}
                >
                  - Remove Checkbox
                </button>
              </div>
            ))}

            {/* Add Checkbox */}
            <button
              className="btn"
              key={'add-checkbox'}
              onClick={(e) => {
                e.preventDefault();
                setCheckboxes((prev) => [
                  ...prev,
                  { id: nextId, label: 'New Checkbox', bool: false },
                ]);
                nextId++;
              }}
            >
              + Add New Checkbox
            </button>
          </div>
        </div>
      </form>
      <form method="dialog" className="modal-action">
        <button className="btn">Close</button>
        {deleteComponent(
          isAdminType,
          isUserAdmin,
          props.type,
          props.data.editables.deletable,
          props.onDelete
        )}
        <button
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formRef.current?.requestSubmit();
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

function deleteComponent(
  isAdminType: boolean,
  isUserAdmin: boolean,
  type: TaskFormType,
  isDeletable: boolean,
  onDelete: Function
) {
  if (isCreatingType(type)) {
    return null;
  } else if ((isAdminType && isUserAdmin) || isDeletable) {
    return (
      <button className="btn" onClick={() => onDelete()}>
        Delete Task
      </button>
    );
  } else {
    return <p>This task is not deletable.</p>;
  }
}

function isCreatingType(type: TaskFormType): boolean {
  return (
    type == TaskFormType.ADMIN_CREATE || type == TaskFormType.CLIENT_CREATE
  );
}

function checkIfAdminType(type: TaskFormType): boolean {
  return type == TaskFormType.ADMIN_CREATE || type == TaskFormType.ADMIN_EDIT;
}

export function AddClientTask(setStateTasks: Function) {
  async function handleSubmit(
    nameRef: RefObject<HTMLInputElement>,
    descRef: RefObject<HTMLInputElement>,
    dueDate: Date,
    checkboxes: TaskCheckbox[]
  ): Promise<boolean> {
    const name = nameRef.current?.value;
    const description = descRef.current?.value;

    if (name == '') {
      return false;
    }

    /* Create the task */
    let res = await fetch('/api/calendar/tasks', {
      method: 'POST',
      body: JSON.stringify({
        id: '',
        name: name,
        description: description,
        dueDate: dueDate,
        checkboxes: checkboxes,
      }),
    });

    /* Response Handling */
    let resText = await res.text();
    if (res.status != 200 || resText !== '') {
      createInfoModal(
        'Error ' + res.status + ': ' + resText,
        <p>{'There was an issue with creating "' + name + '."'}</p>
      );
    } else {
      // successful create
      createToastEvent(
        ToastAlertType.SUCCESS,
        '"' + name + '" successfully created.'
      );
      setStateTasks();
    }
    return true;
  }

  const event = new CustomEvent('add-modal', {
    detail: {
      body: (
        <TaskForm
          data={{
            id: '',
            dueDate: new Date(),
            name: 'New Task',
            description: '',
            checkboxes: [],
            editables: {
              nameEditable: true,
              descEditable: true,
              dueEditable: true,
              deletable: false,
            },
            classId: null,
          }}
          type={TaskFormType.CLIENT_CREATE}
          onClose={() => {}}
          onSubmit={handleSubmit}
          onDelete={() => {}}
        />
      ),
    },
  });
  document.dispatchEvent(event);
}

export function AddClassTask(setStateTasks: Function) {
  async function confirm(
    name: string,
    desc: string,
    dueDate: Date,
    checkboxes: TaskCheckbox[],
    classId: number
  ): Promise<boolean> {
    if (name == '') {
      return false;
    }

    let res = await fetch('/api/classes/tasks', {
      method: 'POST',
      body: JSON.stringify({
        taskId: '',
        classId: classId,
        oldName: '',
        newName: name,
        description: desc,
        dueDate: dueDate,
        checkboxes: checkboxes,
      }),
    });

    const resText = await res.text();
    if (res.status != 200 || resText !== '') {
      createInfoModal(
        'Error ' + res.status + ': ' + resText,
        <p>
          {'There was a problem with creating "' + name + '" for the class.'}
        </p>
      );
    } else {
      // successful create
      createToastEvent(
        ToastAlertType.SUCCESS,
        '"' + name + '" successfully created for the class.'
      );
      setStateTasks();
    }
    return true;
  }

  function handleSubmit(
    nameRef: RefObject<HTMLInputElement>,
    descRef: RefObject<HTMLInputElement>,
    dueDate: Date,
    checklist: TaskCheckbox[],
    classRef: RefObject<HTMLSelectElement | null>
  ): boolean {
    const name = nameRef.current?.value;
    const description = descRef.current?.value;
    const classVal = classRef.current?.value;

    if (name == '' || classVal == 'None') {
      return false;
    }

    createConfirmModal(
      <p>
        {'You are about to create "' +
          name +
          '" for a class, meaning that this task will also be created for users.  Do you wish to continue?'}
      </p>,
      () => confirm(name, description, dueDate, checklist, Number(classVal))
    );
    return true;
  }

  const event = new CustomEvent('add-modal', {
    detail: {
      body: (
        <TaskForm
          data={{
            id: '',
            dueDate: new Date(),
            name: 'New Task',
            description: '',
            checkboxes: [],
            editables: {
              nameEditable: true,
              descEditable: true,
              dueEditable: true,
              deletable: false,
            },
            classId: null,
          }}
          type={TaskFormType.ADMIN_CREATE}
          onClose={() => {}}
          onSubmit={handleSubmit}
          onDelete={() => {}}
        />
      ),
    },
  });
  document.dispatchEvent(event);
}
