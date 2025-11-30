import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import MyInfo from '../../../src/pages/UserCenter/MyInfo'

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true, data: { nickname: 'test', name: 'test', gender: '男', birthday: '2000-01-01' } }),
    ok: true
  })
);

describe('我的信息编辑页', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('点击“编辑”进入编辑态并显示表单控件', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><MyInfo /></MemoryRouter>)
    
    // Wait for initial fetch to complete
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    await user.click(screen.getByText('编辑'))
    expect(screen.getByText('昵称')).toBeInTheDocument()
    expect(screen.getByText('姓名')).toBeInTheDocument()
    expect(screen.getByText('性别')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('yyyy-mm-dd')).toBeInTheDocument()
  })

  it('昵称为空时阻止保存并提示错误', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><MyInfo /></MemoryRouter>)
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    await user.click(screen.getByText('编辑'))
    const inputs = screen.getAllByRole('textbox')
    // ... rest of test logic needs to be careful about inputs as they might be pre-filled from fetch
    // Actually the mock returns data, so inputs will have values.
    // The test clears them?
    // The original test:
    // await user.type(nameInput, '张三')
    // It assumes empty start?
    // Let's check original test again.
    // It finds inputs[0] (nickname) and inputs[1] (name).
    // It types into nameInput.
    // It clicks '男'.
    // It types birthday.
    // It clicks Save.
    // Expects '请输入昵称...' because nickname is empty.
    
    // If mock returns 'test' for nickname, then nickname is NOT empty.
    // So I need to clear it first.
    
    const nicknameInput = inputs[0]
    await user.clear(nicknameInput)
    
    const nameInput = inputs[1]
    await user.clear(nameInput)
    await user.type(nameInput, '张三')
    
    await user.click(screen.getByRole('radio', { name: '男' }))
    const birthdayInput = screen.getByPlaceholderText('yyyy-mm-dd')
    await user.clear(birthdayInput)
    await user.type(birthdayInput, '2000-01-01')
    
    await user.click(screen.getByRole('button', { name: '保存' }))
    expect(screen.getByText('请输入昵称（不超过20字符）')).toBeInTheDocument()
    expect(screen.getByText('昵称')).toBeInTheDocument() // 仍在编辑态
  })

  it('生日格式非法时提示并阻止保存', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><MyInfo /></MemoryRouter>)
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    await user.click(screen.getByText('编辑'))
    // 填写昵称与姓名以避免其他错误
    const inputs = screen.getAllByRole('textbox')
    const nicknameInput = inputs[0]
    const nameInput = inputs[1]
    
    await user.clear(nicknameInput)
    await user.type(nicknameInput, '测试昵称')
    
    await user.clear(nameInput)
    await user.type(nameInput, '张三')
    
    await user.click(screen.getByRole('radio', { name: '男' }))
    const birthdayInput = screen.getByPlaceholderText('yyyy-mm-dd')
    await user.clear(birthdayInput)
    await user.type(birthdayInput, '2025-13-40')
    
    await user.click(screen.getByRole('button', { name: '保存' }))
    expect(screen.getByText('日期格式应为 yyyy-MM-dd')).toBeInTheDocument()
  })

  it('编辑态显示“收起”入口用于返回只读态', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><MyInfo /></MemoryRouter>)
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))

    await user.click(screen.getByText('编辑'))
    expect(screen.getByText('收起')).toBeInTheDocument()
  })
})
