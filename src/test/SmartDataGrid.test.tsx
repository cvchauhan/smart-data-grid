// tests/SmartDataGrid.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SmartDataGrid from '../components/SmartDataGrid';
import '@testing-library/jest-dom';

describe('SmartDataGrid', () => {
  const columns = [
    { field: 'name', header: 'Name' },
    { field: 'age', header: 'Age' },
    { field: 'role', header: 'Role' },
  ];

  const dataSource = [
    { name: 'Alice', age: 30, role: 'Developer' },
    { name: 'Bob', age: 25, role: 'Designer' },
    { name: 'Charlie', age: 35, role: 'Manager' },
  ];

  it('renders column headers', () => {
    render(<SmartDataGrid columns={columns} dataSource={dataSource} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Role')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(<SmartDataGrid columns={columns} dataSource={dataSource} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('filters data on search', () => {
    render(<SmartDataGrid columns={columns} dataSource={dataSource} searchable />);
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'alice' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('shows message for empty data', () => {
    render(<SmartDataGrid columns={columns} dataSource={[]} />);
    expect(screen.getByText('No data source provided')).toBeInTheDocument();
  });

  it('shows message for empty columns', () => {
    render(<SmartDataGrid columns={[]} dataSource={dataSource} />);
    expect(screen.getByText('No columns defined')).toBeInTheDocument();
  });

  it('allows sorting by column', () => {
    render(<SmartDataGrid columns={columns} dataSource={dataSource} />);
    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader); // sort asc
    fireEvent.click(nameHeader); // sort desc
    fireEvent.click(nameHeader); // reset
    expect(nameHeader).toBeInTheDocument();
  });

  it('displays pagination controls', () => {
    render(<SmartDataGrid columns={columns} dataSource={dataSource} paginationOptions={[1]} />);
    expect(screen.getByText('⏮️')).toBeInTheDocument();
    expect(screen.getByText('⏭️')).toBeInTheDocument();
  });

  it('handles row selection', () => {
    const onSelectionChange = jest.fn();
    render(
      <SmartDataGrid
        columns={columns}
        dataSource={dataSource}
        enableSelection
        onSelectionChange={onSelectionChange}
      />
    );
    const checkbox = screen.getAllByRole('checkbox')[1]; // skip the 'select all' checkbox
    fireEvent.click(checkbox);
    expect(onSelectionChange).toHaveBeenCalledWith([dataSource[0]]);
  });
});
