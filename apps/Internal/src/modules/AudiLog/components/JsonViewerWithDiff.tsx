import { Text } from '@react/commons/Template/style';
import { isObject } from 'lodash';

export interface IJsonViewerWithDiffProps {
  data: Record<string, any>;
  differences: Record<string, any>;
  isNewData?: boolean;
}
const isPathDifferent = (path: string, differences: Record<string, any>) => {
  const keys = path.split(/\.|\[|\]/).filter(Boolean);
  for (let i = 1; i <= keys.length; i++) {
    const partialPath = keys.slice(0, i).join('.');
    if (differences[partialPath]) {
      return true;
    }
  }
  return false;
};

const JsonViewerWithDiff = ({
  data,
  differences,
  isNewData = false,
}: IJsonViewerWithDiffProps) => {
  const renderJson = (obj: any, path = '', indent = 2) => {
    if (Array.isArray(obj)) {
      return (
        <>
          {'['}
          {obj.map((value, index) => {
            const currentPath = `${path}[${index}]`;
            const isDiff = isPathDifferent(currentPath, differences);
            const isLast = index === obj.length - 1;

            if (isObject(value)) {
              return (
                <div key={currentPath} style={{ paddingLeft: `${indent}ch` }}>
                  {renderJson(value, currentPath, indent + 2)}
                  {!isLast && ','}
                </div>
              );
            }

            return (
              <div key={currentPath} style={{ paddingLeft: `${indent}ch` }}>
                <span
                  style={{
                    color: isDiff ? (isNewData ? 'green' : 'red') : 'black',
                    fontWeight: isDiff ? 'bold' : 'normal',
                  }}
                >
                  {typeof value === 'string' ? `"${value}"` : String(value)}
                </span>
                {!isLast && ','}
              </div>
            );
          })}
          <div style={{ paddingLeft: `${indent - 2}ch` }}>{']'}</div>
        </>
      );
    }

    if (isObject(obj)) {
      const entries = Object.entries(obj);
      return (
        <>
          {'{'}
          {entries.map(([key, value], index) => {
            const currentPath = path ? `${path}.${key}` : key;
            const isDiff = isPathDifferent(currentPath, differences); // Kiểm tra sự khác biệt với key cha
            const isLast = index === entries.length - 1;

            if (isObject(value) || Array.isArray(value)) {
              return (
                <div key={currentPath} style={{ paddingLeft: `${indent}ch` }}>
                  <span
                    style={{
                      color: isDiff ? (isNewData ? 'green' : 'red') : 'black',
                      fontWeight: isDiff ? 'bold' : 'normal',
                    }}
                  >
                    "{key}":
                  </span>{' '}
                  {renderJson(value, currentPath, indent + 2)}
                  {!isLast && ','}
                </div>
              );
            }

            return (
              <div key={currentPath} style={{ paddingLeft: `${indent}ch` }}>
                <span
                  style={{
                    color: isDiff ? (isNewData ? 'green' : 'red') : 'black',
                    fontWeight: isDiff ? 'bold' : 'normal',
                  }}
                >
                  "{key}":
                </span>{' '}
                <span
                  style={{
                    color: isDiff ? (isNewData ? 'green' : 'red') : 'black',
                    fontWeight: isDiff ? 'bold' : 'normal',
                  }}
                >
                  {typeof value === 'string' ? `"${value}"` : String(value)}
                </span>
                {!isLast && ','}
              </div>
            );
          })}
          <div style={{ paddingLeft: `${indent - 2}ch` }}>{'}'}</div>
        </>
      );
    }

    return <span>{String(obj)}</span>;
  };

  return (
    <Text>
      <pre>{renderJson(data)}</pre>
    </Text>
  );
};

export default JsonViewerWithDiff;
