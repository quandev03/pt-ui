import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { FilterReturnType, InputFilterTableType } from './type';
import CInput from '@react/commons/Input';

export const getInputFilter = (
  props: InputFilterTableType,
): FilterReturnType => {
  const { name, defaultValue, disabled = false, placeholder, onFilter } = props;

  const submit = (value: string) => {
    onFilter(name, value);
  };

  return {
    filterDropdown: ({ confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
        <CInput
          placeholder={placeholder || `Tìm kiếm ${name}`}
          onPressEnter={e => {
            e.preventDefault();
            e.stopPropagation();
            submit((e.target as HTMLInputElement).value.trim());
            confirm();
          }}
          onBlur={e => {
            e.preventDefault();
            e.stopPropagation();
            submit((e.target as HTMLInputElement).value.trim());
            confirm();
          }}
          defaultValue={defaultValue ? defaultValue : ''}
          className={name}
          style={{ marginBottom: 8, display: 'block' }}
          allowClear={false}
          disabled={disabled}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered || defaultValue ? "blue" : "silver",
        }}
      />
    ),
    filterDropdownProps: {
      onOpenChange: visible => {
        if (visible) {
          setTimeout(() => {
            const input = document.getElementsByClassName(
              name,
            )[0] as HTMLInputElement;
            if (input) {
              input.focus();
            }
          }, 100);
        }
      },
    },
  };
};
