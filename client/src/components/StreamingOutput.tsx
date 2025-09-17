import React from 'react';

interface StreamingOutputProps {
  text: string;
}

const StreamingOutput: React.FC<StreamingOutputProps> = ({ text }) => {
  if (!text) return null;
  return (
    <div style={{
      marginTop: '12px',
      padding: '12px 14px',
      background: '#f6f8fa',
      border: '1px solid #e1e5ea',
      borderRadius: 8,
      color: '#334155',
      fontSize: '0.95rem',
      lineHeight: 1.6,
      whiteSpace: 'pre-wrap'
    }}>
      <strong>实时输出（模型思考过程）：</strong>
      <div style={{ marginTop: 8 }}>{text}</div>
    </div>
  );
};

export default StreamingOutput;
