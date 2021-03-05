import React, { useCallback, useEffect, useState } from 'react';



function Edit () {
  const [state, setState] = useState(0);

  const s = useCallback(() => {
    return setTimeout(() => {
      setState(state + 1);
    }, 100);
  }, [state])

  useEffect(() => {
    let t = s();
    return () => {
      clearTimeout(t);
    };
  }, [s]);

  return (
    <div>
      Edit1 {state}
    </div>
  );
}

export default Edit;
