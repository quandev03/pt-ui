import { SendOutlined } from '@ant-design/icons';
import CTextArea from '@react/commons/TextArea';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useSendComment } from '../queryHooks';
import { useParams } from 'react-router-dom';

/**
 * @author
 * @function @Comment
 **/

export const Comment = ({
  listComment,
  afterComment,
  isDisable,
}: {
  listComment: any[];
  afterComment: () => void;
  isDisable: boolean;
}) => {
  const [commentContent, setCommentContent] = useState('');

  const { mutate: sendComment } = useSendComment(() => {
    afterComment();
    setCommentContent('');
  });
  const { id } = useParams();
  const handleSendComment = () => {
    if (!commentContent) return;
    sendComment({
      feedbackRequestId: id as string,
      noteContent: commentContent.trim(),
    });
  };

  const handleBlur = (e: any) => {
    if (e.target.value) {
      setCommentContent(e.target.value.trim());
    }
  };

  return (
    <>
      <div
        className="box-comment"
        style={{
          maxHeight: '180px', // Set a maximum height
          overflowY: 'auto', // Enable vertical scrolling
          paddingRight: '10px', // Add padding for scrollbar
          border: '1px solid #ddd', // Optional: Add border for better UI
          borderRadius: '5px', // Optional: Rounded corners
        }}
      >
        {listComment?.map((comment) => (
          <div key={comment?.feedbackRequestId} className="comment-item">
            <div className="comment-info">
              {comment?.createdBy} đã thêm ghi chú -{' '}
              {dayjs(comment?.createdDate).format('DD/MM/YYYY hh:mm:ss A')}
            </div>
            <div className="comment-content" style={{ whiteSpace: 'pre-line' }}>
              {comment?.content}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>Ghi chú</div>
      <div className="input-comment" style={{ display: 'flex', gap: '10px' }}>
        <CTextArea
          rows={3}
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          disabled={isDisable}
          onBlur={handleBlur}
          style={{ flex: 1 }}
          maxLength={200}
        ></CTextArea>
        <SendOutlined
          onClick={handleSendComment}
          className="send"
          style={{
            fontSize: 25,
            color: commentContent ? 'blue' : '#ddd',
            cursor: 'pointer',
          }}
        />
      </div>
    </>
  );
};
